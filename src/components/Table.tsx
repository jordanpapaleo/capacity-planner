export type TableRow = {
  [key: string]: any
}

export type RenderOverride = {
  [key: string]: any
}

export default function Table({
  headings,
  renderOverride,
  rows,
}: {
  headings: string[]
  renderOverride?: RenderOverride
  rows: TableRow[] | null
}) {
  return (
    <table className="w-full">
      <thead>
        <tr>
          {headings.map((heading) => (
            <td key={heading} className="uppercase font-bold px-1">
              <small>{heading}</small>
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows &&
          rows.map((row, i) => {
            return (
              <tr
                key={i}
                className="bg-gray-500 bg-opacity-0 transition-all duration-200 hover:bg-opacity-20"
              >
                {headings.map((heading) => (
                  <td key={heading} className="px-1">
                    {renderOverride && renderOverride[heading]
                      ? renderOverride[heading](row)
                      : row[heading] + ''}
                  </td>
                ))}
              </tr>
            )
          })}
      </tbody>
    </table>
  )
}
