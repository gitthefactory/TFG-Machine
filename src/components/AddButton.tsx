// components/AddButton.tsx
import Link from "next/link";

interface AddButtonProps {
  href: string;
}

const AddButton: React.FC<AddButtonProps> = ({ href }) => {
  return (
    <Link href={href}>
      <div style={{ display: "inline-block" }}>
        <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 focus:outline-none flex items-center gap-1">
          <span>Agregar</span>
          <span className="text-xl">+</span>
        </button>
        <br />
      </div>
    </Link>
  );
};

export default AddButton;
