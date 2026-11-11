export type PackageTier = {
  key: "bronze" | "silver" | "gold";
  name: string;
  price: string;
  priceNote: string;
  evaluation: string;
  features: string[];
  featured?: boolean;
};

export const PACKAGES: PackageTier[] = [
  {
    key: "bronze",
    name: "Bronze",
    price: "$12.99",
    priceNote: "/month",
    evaluation: "No individual evaluation",
    features: [
      "Full access to the KeeperHQ training library",
      "All technical categories",
      "Train anywhere, anytime",
    ],
  },
  {
    key: "silver",
    name: "Silver",
    price: "$44.99",
    priceNote: "/month",
    evaluation: "1 individual evaluation per month",
    features: [
      "All training videos",
      "Up to 3 uploaded training clips",
      "Written and verbal feedback",
      "30-minute Zoom evaluation",
    ],
    featured: true,
  },
  {
    key: "gold",
    name: "Gold",
    price: "$59.99",
    priceNote: "/month",
    evaluation: "2 individual evaluations per month",
    features: [
      "All training videos",
      "Up to 3 uploaded clips per evaluation",
      "Written and verbal feedback",
      "30-minute Zoom evaluations",
      "More consistent individual development",
    ],
  },
];
