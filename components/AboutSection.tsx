
import { Button, Card, CardContent } from "@/components/aspect-ui";
import { Calendar, MapPin, Shield } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: Calendar,
      title: "Easy Booking",
      description: "Schedule pickup with just a few clicks"
    },
    {
      icon: MapPin,
      title: "Real-time Tracking",
      description: "Track your parcel every step of the way"
    },
    {
      icon: Shield,
      title: "Nationwide Coverage",
      description: "Delivering to every corner of the country"
    }
  ];

  return (
    <section className="py-20 bg-bg-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6">
            Fast, Reliable, and Affordable Delivery
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Send your parcels with confidence using Courier Path. Our advanced logistics network ensures
            your packages reach their destination safely and on time, every time.
          </p>
          <Button size="large" variant="primary" className="">
            Book a Pickup
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary-foreground text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-4">{feature.title}</h3>
                <p className="text-text-muted">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
export default AboutSection