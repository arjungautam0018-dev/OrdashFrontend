import { StyleSheet } from "react-native";

export const C = {
  primary:     "#c84b2f",
  primaryDark: "#a33a21",
  bg:          "#f7f6f2",
  card:        "#ffffff",
  text:        "#1a1a1a",
  muted:       "#6b6b6b",
  border:      "#e0ddd7",
  inputBg:     "#fafaf8",
  placeholder: "#b0aca4",
  success:     "#2e7d52",
  error:       "#c0392b",
};

export const shared = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 32,
    paddingBottom: 100,
  },
  brand: {
    alignItems: "center",
    marginBottom: 28,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "700",
    color: C.primary,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 13,
    color: C.muted,
    marginTop: 6,
    textAlign: "center",
  },
  card: {
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: C.text,
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 13,
    color: C.muted,
    marginTop: 4,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: C.muted,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  fieldWrap: {
    marginBottom: 14,
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: C.text,
    marginBottom: 5,
  },
  req: {
    color: C.primary,
  },
  input: {
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: C.text,
  },
  inputFocused: {
    borderColor: C.primary,
    backgroundColor: C.card,
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  pwWrap: {
    position: "relative",
  },
  pwInput: {
    paddingRight: 44,
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    top: 10,
    padding: 2,
  },
  strengthBar: {
    flexDirection: "row",
    gap: 4,
    marginTop: 6,
  },
  strengthSeg: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: C.border,
  },
  hint: {
    fontSize: 12,
    color: C.muted,
    marginTop: 4,
  },
  submitBtn: {
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 20,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  bottomLink: {
    textAlign: "center",
    fontSize: 13,
    color: C.muted,
    marginTop: 16,
  },
  bottomLinkAccent: {
    color: C.primary,
    fontWeight: "500",
  },
  forgotWrap: {
    alignItems: "flex-end",
    marginTop: -4,
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 12,
    color: C.primary,
  },
});
