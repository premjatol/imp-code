import { useTranslation } from "react-i18next";
import { FcDeleteDatabase } from "react-icons/fc";

export default function NoDataAvailable({ isDiv, colSpan }) {
  const { t } = useTranslation();

  return isDiv ? (
    <div className="text-center py-16">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-linear-to-br from-red-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
          <FcDeleteDatabase fontSize={36} color="red" />
        </div>
        <p className="text-gray-600 font-semibold text-lg mb-2">
          No Data Available
        </p>

        <p className="text-gray-400 text-sm">Here is no any data available.</p>
      </div>
    </div>
  ) : (
    <tr className="text-center" style={{ border: "none" }}>
      <td colSpan={colSpan && colSpan}>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-linear-to-br from-red-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
            <FcDeleteDatabase fontSize={36} color="red" />
          </div>
          <p className="text-gray-600 font-semibold text-lg mb-2">
            No Data Available
          </p>

          <p className="text-gray-400 text-sm">
            Here is no any data available.
          </p>
        </div>
      </td>
    </tr>
  );
}
