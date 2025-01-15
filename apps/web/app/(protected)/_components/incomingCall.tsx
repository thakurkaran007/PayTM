import { useEffect } from 'react';
import { incomingcall, userSocket } from "@/jotai/atoms";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/src/components/avatar";
import { Button } from "@repo/ui/src/components/button";
import { Card, CardContent, CardFooter, CardHeader } from "@repo/ui/src/components/card";
import { useAtom } from "jotai";
import { FaUser } from "react-icons/fa";
import { MdCall, MdCallEnd } from 'react-icons/md';

const IncomingCall = () => {
  const [incoming, setIncoming] = useAtom(incomingcall);
  const [socket, setSocket] = useAtom(userSocket);

  const decline = () => {
    socket?.send(JSON.stringify({ type: "decline", user: incoming?.caller }));
    setIncoming(null);
  }

  if (!incoming) return null; 

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="flex items-center space-x-4 p-4">
          <Avatar className="cursor-pointer">
            <AvatarImage src={incoming?.caller.image || ""} />
            <AvatarFallback className="bg-sky-300 h-full w-full rounded-full flex items-center justify-center">
              <FaUser size={24} />
            </AvatarFallback>
          </Avatar>
          <div className="text-lg font-semibold">{incoming?.caller.name}</div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-gray-600">Incoming call...</p>
        </CardContent>
        <CardFooter className="flex justify-around p-4">
          <Button className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600">
            <MdCall size={24} className="text-white" />
          </Button>
          <Button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600" onClick={() => decline()}>
            <MdCallEnd size={24} className="text-white" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IncomingCall;
