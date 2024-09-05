export function getInitials(name?: string) {
  if (!name) return undefined;
  let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");
  let initials = [...name?.matchAll(rgx)] || [];
  let _initials = (
    (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
  ).toUpperCase();
  return _initials;
}

export const truncate = (str: string, max = 10) => {
  const array = str.trim();
  const ellipsis = array.length > max ? "..." : "";
  return array.slice(0, max) + ellipsis;
};
