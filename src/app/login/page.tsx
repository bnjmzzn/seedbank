import FormCard from "./_components/FormCard";
import InfoCarousel from "./_components/InfoCarousel";

export default function LoginPage() {
    return (
        <div className="flex min-h-screen">
            <div className="hidden md:flex md:flex-1 items-center justify-center">
                <InfoCarousel />
            </div>
            <div className="flex flex-1 items-center justify-center">
                <FormCard />
            </div>
        </div>
    );
}