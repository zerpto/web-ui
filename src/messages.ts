/** Every text the shared components render themselves. Hosts may override any of them. */
export type UiMessages = {
  cancel: string;
  retry: string;
  search: string;
  selectAll: string;
  selectRow: string;
  selectedCount: (count: number) => string;
  clearSelection: string;
  noResults: string;
  noResultsBody: string;
  loadMore: string;
  actions: string;
  copy: string;
  copied: string;
  increase: string;
  decrease: string;
  showPassword: string;
  hidePassword: string;
  loadErrorTitle: string;
  loadErrorBody: string;
  noAccessTitle: string;
  noAccessBody: string;
};

export const uiMessages: Record<"en" | "id", UiMessages> = {
  en: {
    cancel: "Cancel",
    retry: "Try again",
    search: "Search",
    selectAll: "Select all rows",
    selectRow: "Select row",
    selectedCount: (count) => `${new Intl.NumberFormat("en").format(count)} selected`,
    clearSelection: "Clear selection",
    noResults: "No matches",
    noResultsBody: "Try a different search or clear the filters.",
    loadMore: "Load more",
    actions: "Actions",
    copy: "Copy",
    copied: "Copied",
    increase: "Increase",
    decrease: "Decrease",
    showPassword: "Show password",
    hidePassword: "Hide password",
    loadErrorTitle: "We couldn't load this page",
    loadErrorBody: "The server didn't respond as expected. Check your connection and try again.",
    noAccessTitle: "You don't have access to this page",
    noAccessBody:
      "Your role doesn't include the permission this page needs. Ask a workspace admin if you think you should have it.",
  },
  id: {
    cancel: "Batal",
    retry: "Coba lagi",
    search: "Cari",
    selectAll: "Pilih semua baris",
    selectRow: "Pilih baris",
    selectedCount: (count) => `${new Intl.NumberFormat("id").format(count)} dipilih`,
    clearSelection: "Hapus pilihan",
    noResults: "Tidak ada yang cocok",
    noResultsBody: "Coba pencarian lain atau hapus filter.",
    loadMore: "Muat lebih banyak",
    actions: "Aksi",
    copy: "Salin",
    copied: "Tersalin",
    increase: "Tambah",
    decrease: "Kurangi",
    showPassword: "Tampilkan kata sandi",
    hidePassword: "Sembunyikan kata sandi",
    loadErrorTitle: "Halaman ini tidak dapat dimuat",
    loadErrorBody:
      "Server tidak merespons sebagaimana mestinya. Periksa koneksi Anda lalu coba lagi.",
    noAccessTitle: "Anda tidak memiliki akses ke halaman ini",
    noAccessBody:
      "Peran Anda tidak mencakup izin yang dibutuhkan halaman ini. Hubungi admin workspace jika menurut Anda seharusnya punya akses.",
  },
};
