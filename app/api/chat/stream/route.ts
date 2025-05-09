import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { submitQuestion } from "@/lib/langgraph";
import { ChatRequestBody, SSE_DATA_PREFIX, SSE_LINE_DELIMITER, StreamMessage, StreamMessageType } from "@/lib/types";
import { auth } from "@clerk/nextjs/server"
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { SERVER_PROPS_ID } from "next/dist/shared/lib/constants";
import { NextResponse } from "next/server";


function sendSSEMessage(writer: WritableStreamDefaultWriter<Uint8Array>, data: StreamMessage) {
    const encoder = new TextEncoder();
    return writer.write(encoder.encode(`${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`));

};



export async function POST(req: Request) {
    try {

        const { userId } = await auth();

        if (!userId) {
            return new Response('Unauthorized', { status: 401 });
        }
        //console.log("User ID: ", userId);
        //  check
        const body = await req.json() as ChatRequestBody;
        const { messages, newMessage, chatId } = body;

        if (!chatId) {
            throw new Error("chatId is required but was not provided in the request body.");
        }

        const convex = getConvexClient();

        const stream = new TransformStream({}, { highWaterMark: 1024 });

        const writer = stream.writable.getWriter();

        const response = new Response(stream.readable, {
            headers: {
                "content-type": "text/event-stream",
                Connection: "keep-alive",
                "X-Accel-Buffering": "no", // Disable buffering for nginx
            },
        });


        const startStream = async () => {
            try {
                await sendSSEMessage(writer, { type: StreamMessageType.Connected });

                await convex.mutation(api.messages.send, {
                    chatId,
                    content: newMessage,
                });
                

                const langChainMessages=[
                    ...messages.map((msg)=>
                    msg.role==="user"?new HumanMessage(msg.content):new AIMessage(msg.content)
                    ),
                    new HumanMessage(newMessage),
                ];

                try{
                    const eventStream = await submitQuestion(langChainMessages, chatId);

                    for await (const event of eventStream) {
                        if (event.event === "on_chat_model_stream") {
                            const token = event.data.chunk;
                            
                            if (token){
                                const text=token.content.at(0)?.["text"];

                                if(text){
                                    await sendSSEMessage(writer, {
                                        type: StreamMessageType.Token,
                                        token: text,
                                    });
                                }
                            }

                        } else if (event.event === "on_tool_start") {
                            await sendSSEMessage(writer, {
                                type: StreamMessageType.ToolStart,
                                tool: event.name || "Unknown",
                                input : event.data.input,
                            });
                        } else if (event.event === "on_tool_end") {
                            const toolMessage= new ToolMessage(event.data.output);



                            await sendSSEMessage(writer, {
                                type: StreamMessageType.ToolEnd,
                                tool: toolMessage.lc_kwargs.name || "Unknown",
                                output: event.data.output,
                            });
                        }
                    }
                    
                    await sendSSEMessage(writer, { type: StreamMessageType.Done });

                }catch(StreamError){
                    console.error("Error in Event Stream:", StreamError);
                    await sendSSEMessage(writer, { type: StreamMessageType.Error, error: StreamError instanceof Error ? StreamError.message : "Stream Processing Failed" ,
                    });
                 }


            } catch(error){
                console.error("Error in Event Stream: ", error);
                await sendSSEMessage(writer, { type: StreamMessageType.Error, error: error instanceof Error ? error.message : "Unknown Error" ,
                });
            } finally {
               try{
                    await writer.close();
                } catch (closeError) {
                    console.error("Error closing writer: ", closeError);
                }
        }
        };

        startStream();

        return response;

    } catch (e) {

        console.log("Error in chat API: ", e)
        return NextResponse.json(
            { error: "Failed to process chat request" } as const,
            { status: 500 }
        );

    }
}