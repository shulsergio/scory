export default function ImageFlag(props: {
  code: string | null | undefined;
  w?: string;
  h?: string;
}) {
  if (!props || !props.code) return null;
  const sm_code = props.code.toLowerCase();
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${sm_code}.svg`}
      width={props.w || "36"}
      height={props.h || "24"}
      alt={sm_code}
      style={{
        marginRight: "10px",
        borderRadius: "2px",
        verticalAlign: "middle",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      }}
      title={sm_code}
    />
  );
}
