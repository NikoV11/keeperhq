import { PageHeader } from "@/components/admin/ui";
import { VideoForm } from "../video-form";

export default function NewVideoPage() {
  return (
    <div>
      <PageHeader
        title="Upload a Training Video"
        description="Add a new exercise to your training library."
      />
      <VideoForm />
    </div>
  );
}
