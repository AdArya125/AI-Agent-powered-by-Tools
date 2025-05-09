import { Doc, Id } from "@/convex/_generated/dataModel"
import { NavigationContext } from "@/lib/NavigationProvider";
import { TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { Button } from "./ui/button";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import TimeAgo from "react-timeago";

function ChatRow({
    chat,
    onDelete
}:{
    chat:Doc<"chats">,
    onDelete: (id:Id<"chats">) => void
}) {

    const router = useRouter();
    const {closeMobileNav} = useContext(NavigationContext);


    const lastMessage = useQuery(api.messages.getLastMessage, { chatId: chat._id,    
    });
    const handleClick = () => {
        router.push(`/dashboard/chat/${chat._id}`);
        closeMobileNav();
    }
    return (
        <div onClick={handleClick} className="group rounded-xl border border-gray-200/30 bg-white/50 backdrop-blur-sm cursor-pointer shadow-sm  transition-all duration-200 hover:shadow-md"        
        >
            
            <div className="p-4">
                <div className="flex justify-between items-center">
                    {lastMessage?.content  && lastMessage?.content.length > 30 
                        ? `${lastMessage.content.slice(0, 30)}...` 
                        : lastMessage?.content}
                    <Button 
                        variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 -mr-2 -mt-2 ml-2 transition-opacity duration-200"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(chat._id);
                        }}
                    >
                    <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
                    </Button>
                </div>


                {/* Last Message*/}
                {lastMessage && <p className="text-xs text-gray-400 mt-1.5 font-medium">
                    <TimeAgo date={lastMessage.createdAt}   />
                </p>}



            </div>
        </div>
    )
}

export default ChatRow