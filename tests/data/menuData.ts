export interface NavItem {
  category: string;
  item: string;
  expectedUrlPart: string;
  isExternal?: boolean;
}

export const NAV_MENU_ITEMS: NavItem[] = [
  { category: "Individual", item: "Buy Crypto", expectedUrlPart: "buy.simplex" },
  { category: "Business", item: "TurnKey Onramp Solution", expectedUrlPart: "/turnkey-solution" },
  { category: "Business", item: "Coin Listing", expectedUrlPart: "/coin-listing" },
  { category: "Business", item: "NFT Dir3ct", expectedUrlPart: "/nft-dir3ct" },
  { category: "Business", item: "Integrations Portal", expectedUrlPart: "/getting-started" },
  { category: "Company", item: "About Us", expectedUrlPart: "/about" },
  { category: "Company", item: "Careers", expectedUrlPart: "/careers" },
  { category: "Company", item: "News", expectedUrlPart: "/blog-news" },
  { category: "Support", item: "Payment Status", expectedUrlPart: "/payment-status", isExternal: true },
  { category: "Support", item: "Help Center", expectedUrlPart: "/help-center" },
  { category: "Support", item: "Service Updates", expectedUrlPart: "/system-status" },
];
