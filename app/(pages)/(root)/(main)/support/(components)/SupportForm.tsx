import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SupportForm() {
  return (
    <Card className="shadow-lg rounded-2xl">
      <CardContent className="p-6 space-y-4">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-[7px]">
              Full Name
            </label>
            <Input type="text" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-[7px]">
              Email Address
            </label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-[7px]">
              Subject
            </label>
            <Input type="text" placeholder="Issue or Question" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-[7px]">
              Message
            </label>
            <Textarea
              rows={5}
              placeholder="Please describe your issue or question in detail..."
            />
          </div>
          <div className="text-right">
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
