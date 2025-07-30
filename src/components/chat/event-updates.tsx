import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { events } from "@/lib/data";
import { Calendar, MapPin } from "lucide-react";

export function EventUpdates() {
    return (
        <div className="flex flex-col h-full bg-background">
            <div className="p-4 border-b">
                <h1 className="text-2xl font-headline font-bold">Upcoming Events</h1>
                <p className="text-muted-foreground">Stay connected with your community</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {events.map((event) => (
                    <Card key={event.id} className="bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="font-headline text-primary">{event.title}</CardTitle>
                            <CardDescription className="flex items-center gap-4 pt-2">
                                <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-accent"/> {event.date}</span>
                                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-accent"/> {event.location}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>{event.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
