type Props = {
  texto: string;
  onClick?: () => void;
};

export default function Boton({ texto, onClick }: Props) {
  return (
    <button onClick={onClick} style={{ padding: "10px", cursor: "pointer" }}>
      {texto}
    </button>
  );
}