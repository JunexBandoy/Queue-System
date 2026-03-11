import React, { ReactNode } from "react";

interface Props {
  dataSource: any[] | { data: any[] };
  children?: React.ReactNode;
}

export const TableFields: React.FC<Props> = ({ dataSource, children }) => {
  const fields = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => {
      const props = child.props as TableFieldProps;
      return {
        headerText: props.headerText,
        field: props.field,
        template: props.template,
        width: props.width,
        type: props.template ? "template" : "field",
      };
    });

  const dataRows = Array.isArray(dataSource)
    ? dataSource
    : dataSource?.data ?? [];

  return (
    <>
      <table className="w-full divide-y divide-gray-300 table-fixed">
        <thead className="bg-green-100">
          <tr>
            {fields.map((field, index) => (
              <th
                key={index}
                className={`py-3.5 pl-6 pr-3 lg:text-sm md:text-sm text-xs font-semibold text-left text-black ${
                  field.width ? "" : "w-44"
                }`}
                style={
                  field.width
                    ? {
                        width: /^\d+$/.test(field.width)
                          ? `${field.width}px`
                          : field.width,
                      }
                    : undefined
                }
              >
                {field.headerText}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={
                rowIndex % 2 === 0
                  ? "bg-gray-50"
                  : "bg-primary-500 bg-opacity-15"
              }
            >
              {fields.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`whitespace-nowrap text-start py-3 pl-6 pr-3 lg:text-sm md:text-sm text-xs font-normal align-top text-gray-900 ${
                    col.width ? "" : "w-44"
                  }`}
                  style={
                    col.width
                      ? {
                          width: /^\d+$/.test(col.width)
                            ? `${col.width}px`
                            : col.width,
                        }
                      : undefined
                  }
                >
                  {col.type === "template"
                    ? col.template?.(row)
                    : row[col.field ?? ""]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

interface TableFieldProps {
  headerText?: string;
  field?: string;
  template?: (row: any) => ReactNode;
  width?: string;
}

export const TableField = (_props: TableFieldProps) => {
  return null;
};
