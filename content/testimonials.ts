export type VideoTestimonial = {
  id: string;
  name: string;
  age?: number;
  affiliation: string;
  quote?: string;
  videoPath: string | null;
  thumbnailPath: string;
  featured?: boolean;
};

export type WrittenTestimonial = {
  id: string;
  name: string;
  affiliation: string;
  quote: string;
};

// PLACEHOLDER CONTENT — real testimonial videos and approved quotes pending.
export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "vt-1",
    name: "Goalkeeper name pending",
    affiliation: "Club / College pending",
    quote: "Testimonial quote pending approval.",
    videoPath: null,
    thumbnailPath: "/images/placeholder/testimonial.svg",
    featured: true,
  },
  {
    id: "vt-2",
    name: "Goalkeeper name pending",
    affiliation: "Club / College pending",
    quote: "Testimonial quote pending approval.",
    videoPath: null,
    thumbnailPath: "/images/placeholder/testimonial.svg",
    featured: true,
  },
  {
    id: "vt-3",
    name: "Parent name pending",
    affiliation: "Parent testimonial",
    quote: "Testimonial quote pending approval.",
    videoPath: null,
    thumbnailPath: "/images/placeholder/testimonial.svg",
    featured: true,
  },
];

export const WRITTEN_TESTIMONIALS: WrittenTestimonial[] = [
  {
    id: "wt-1",
    name: "Name pending",
    affiliation: "Club / College pending",
    quote: "Written testimonial pending approval before launch.",
  },
  {
    id: "wt-2",
    name: "Name pending",
    affiliation: "Parent",
    quote: "Written testimonial pending approval before launch.",
  },
];

export type Goalkeeper = {
  id: string;
  name: string;
  affiliation: string;
  level: string;
  coach?: string;
  quote?: string;
  photoPath: string;
};

// PLACEHOLDER CONTENT — real goalkeeper references pending permission.
export const GOALKEEPERS: Goalkeeper[] = Array.from({ length: 6 }, (_, i) => ({
  id: `gk-${i + 1}`,
  name: "Goalkeeper name pending",
  affiliation: "Club / College pending",
  level: "Playing level pending",
  coach: "Coach pending",
  photoPath: "/images/placeholder/goalkeeper.svg",
}));
