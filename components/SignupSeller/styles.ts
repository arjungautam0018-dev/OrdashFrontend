import { StyleSheet } from "react-native";
import { s, sf } from "../../Extras/responsive";

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
    paddingHorizontal: s(20),
    paddingVertical: s(32),
    paddingBottom: s(100),
  },
  brand: {
    alignItems: "center",
    marginBottom: s(28),
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(8),
  },
  brandName: {
    fontSize: sf(22),
    fontWeight: "700",
    color: C.primary,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: sf(13),
    color: C.muted,
    marginTop: s(6),
    textAlign: "center",
  },
  card: {
    backgroundColor: C.card,
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: C.border,
    padding: s(24),
  },
  cardTitle: {
    fontSize: sf(20),
    fontWeight: "700",
    color: C.text,
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: sf(13),
    color: C.muted,
    marginTop: s(4),
    marginBottom: s(20),
  },
  sectionLabel: {
    fontSize: sf(11),
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: C.muted,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: s(16),
    marginTop: s(16),
    marginBottom: s(12),
  },
  row: {
    flexDirection: "row",
    gap: s(12),
  },
  fieldWrap: {
    marginBottom: s(14),
    flex: 1,
  },
  label: {
    fontSize: sf(13),
    fontWeight: "500",
    color: C.text,
    marginBottom: s(5),
  },
  req: {
    color: C.primary,
  },
  input: {
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: s(10),
    paddingHorizontal: s(12),
    paddingVertical: s(10),
    fontSize: sf(14),
    color: C.text,
  },
  inputFocused: {
    borderColor: C.primary,
    backgroundColor: C.card,
  },
  textarea: {
    minHeight: s(80),
    textAlignVertical: "top",
  },
  pwWrap: {
    position: "relative",
  },
  pwInput: {
    paddingRight: s(44),
  },
  eyeBtn: {
    position: "absolute",
    right: s(12),
    top: s(10),
    padding: s(2),
  },
  strengthBar: {
    flexDirection: "row",
    gap: s(4),
    marginTop: s(6),
  },
  strengthSeg: {
    flex: 1,
    height: s(3),
    borderRadius: s(2),
    backgroundColor: C.border,
  },
  hint: {
    fontSize: sf(12),
    color: C.muted,
    marginTop: s(4),
  },
  submitBtn: {
    backgroundColor: C.primary,
    borderRadius: s(10),
    paddingVertical: s(13),
    alignItems: "center",
    marginTop: s(20),
  },
  submitBtnText: {
    color: "#fff",
    fontSize: sf(15),
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  bottomLink: {
    textAlign: "center",
    fontSize: sf(13),
    color: C.muted,
    marginTop: s(16),
  },
  bottomLinkAccent: {
    color: C.primary,
    fontWeight: "500",
  },
  forgotWrap: {
    alignItems: "flex-end",
    marginTop: s(-4),
    marginBottom: s(16),
  },
  forgotText: {
    fontSize: sf(12),
    color: C.primary,
  },
});
