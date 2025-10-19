import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Zap, Target, Users } from "lucide-react";

export default function AboutPage() {
    const aboutImage = PlaceHolderImages.find(img => img.id === 'hero');

    return (
        <div className="bg-background">
            <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline">About TechNova</h1>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                        We are passionate about bringing the future of technology to you today. Discover our story, our mission, and the values that drive us forward.
                    </p>
                </div>

                <div className="mt-12 rounded-lg overflow-hidden">
                    {aboutImage && (
                        <Image
                            src={aboutImage.imageUrl}
                            alt="Our Team"
                            width={1200}
                            height={500}
                            className="w-full h-auto object-cover"
                            data-ai-hint="office technology"
                        />
                    )}
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                            <Zap className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold font-headline">Our Mission</h2>
                        <p className="mt-2 text-muted-foreground">
                            To empower our customers by providing access to the latest and most innovative technology, making life more connected, productive, and enjoyable.
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                            <Target className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold font-headline">Our Vision</h2>
                        <p className="mt-2 text-muted-foreground">
                            To be the most trusted and customer-centric online destination for electronics, known for our curated selection, expert advice, and exceptional service.
                        </p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground mb-4">
                            <Users className="h-8 w-8" />
                        </div>
                        <h2 className="text-2xl font-bold font-headline">Our Values</h2>
                        <p className="mt-2 text-muted-foreground">
                            Innovation, integrity, and a relentless focus on customer satisfaction are at the core of everything we do. We believe in building lasting relationships.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
