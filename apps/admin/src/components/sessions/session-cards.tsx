import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Link } from "@tanstack/react-router";


import { Button } from "@rexolute/ui/button";
import { Card, CardContent } from "@rexolute/ui/card";

export const SessionCard = ({
  clientName,
  profileImg,
  therapistName,
  therapistTitle,
  date,
  time,
  type,
  id,
}: {
  clientName?: string;
  therapistName: string;
  therapistTitle: string;
  profileImg?: string;
  date: string;
  time: string;
  type: string;
  id: string;
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 overflow-hidden rounded-full">
            <img
              src={
                profileImg ?? "/svg/placeholder.svg?height=48&width=48"
              }
              alt="Therapist"
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-medium">{therapistName}</div>
            <div className="text-xs text-muted-foreground">
              {therapistTitle}
            </div>
          </div>
        </div>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-green-600" />
            <span>{type}</span>
          </div>
          {/* <div>
            <div className="font-semibold">{clientName}</div>
            <div className="text-sm text-muted-foreground">Client</div>
          </div> */}
        </div>

        <Link to={`/sessions/details?id=${id}&mode=default`}>
          <Button
            variant="outline"
            className="w-full rounded-full text-green-600 border-green-600"
          >
            View details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};
