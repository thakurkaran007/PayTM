
import Navbar from "./_components/navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] min-h-screen">
            <Navbar />
            {children}
        </div>
    );
};

export default AuthLayout;