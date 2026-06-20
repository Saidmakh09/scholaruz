// Curated, free-to-use photography of Uzbekistan (from Wikimedia Commons),
// downloaded into /public/images so they serve fast and reliably from our own
// origin instead of hotlinking an external host.

export type SiteImage = {
  src: string;
  alt: string;
  credit: string;
};

export const uz = {
  registan: {
    src: "/images/registan.jpg",
    alt: "The Registan, a public square framed by three madrasas in Samarkand",
    credit: "The Registan, Samarkand",
  },
  poiKalon: {
    src: "/images/poikalon.jpg",
    alt: "The Po i Kalon complex and minaret in Bukhara",
    credit: "Po i Kalon, Bukhara",
  },
  khiva: {
    src: "/images/khiva.jpg",
    alt: "The Islam Khodja minaret and madrasa in Khiva",
    credit: "Islam Khodja, Khiva",
  },
  chorsu: {
    src: "/images/chorsu.jpg",
    alt: "Daily life at Chorsu Bazaar in Tashkent",
    credit: "Chorsu Bazaar, Tashkent",
  },
  campus: {
    src: "/images/campus.jpg",
    alt: "A university campus in Tashkent where students study",
    credit: "A university campus in Tashkent",
  },
} satisfies Record<string, SiteImage>;

export const galleryImages: SiteImage[] = [uz.registan, uz.poiKalon, uz.khiva, uz.chorsu];
