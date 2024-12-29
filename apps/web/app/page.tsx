import { Button } from "@repo/ui/src/components/button";

const Home = () => {
  return (
      <div className="flex justify-center items-center h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800"> 
          <div className="flex justify-center flex-col items-center space-y-6">
            <h1 className="text-6xl font-semibold text-white drop-shadow-md">🔐 Auth</h1>
              <Button variant={"outline"}>SignIn</Button>
          </div>
      </div>
  )
} 
export default Home;