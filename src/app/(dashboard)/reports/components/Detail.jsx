export default function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
