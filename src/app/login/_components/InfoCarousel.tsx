"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

const slides = [
    {
        image: "/images/carousel/slide1.png",
        title: "Grow your seeds",
        description: "Claim daily seeds and watch your balance grow.",
    },
    {
        image: "/images/carousel/slide2.png",
        title: "Play games",
        description: "Bet your seeds on coinflip, dice, and more.",
    },
    {
        image: "/images/carousel/slide3.png",
        title: "Steal from others",
        description: "Take risks. Rob your friends.",
    },
];

export default function InfoCarousel() {
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) return;
        const interval = setInterval(() => api.scrollNext(), 7000);
        return () => clearInterval(interval);
    }, [api]);

    return (
        <Carousel setApi={setApi} opts={{ loop: true, watchDrag: false }} className="w-full max-w-sm">
            <CarouselContent>
                {slides.map((slide, i) => (
                    <CarouselItem key={i}>
                        <div className="flex flex-col items-center gap-4 p-8 text-center">
                            <div className="relative w-full h-64">
                                <Image src={slide.image} alt={slide.title} fill className="object-contain rounded-lg" />
                            </div>
                            <h2 className="text-2xl font-bold">{slide.title}</h2>
                            <p className="text-muted-foreground">{slide.description}</p>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}