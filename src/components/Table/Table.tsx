import { Row } from "utils";

export const Table = ({ rows }: { rows: Row[] }) => {
  return (
    <table className="text-xs slashed-zero tabular-nums w-full rounded-md">
      <tbody>
        {rows.map(({ id, cells }) => (
          <tr key={id} className="odd:bg-gray-100">
            {cells.map(({ id, text }) => (
              <td
                key={id}
                className="p-1 border border-solid border-gray-300 whitespace-pre-line"
              >
                {!text.length ? (
                  <span className="text-gray-400">Empty cell</span>
                ) : (
                  text
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
