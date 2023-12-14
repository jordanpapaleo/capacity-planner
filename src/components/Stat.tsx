// https://daisyui.com/components/stat/
const Stat = ({
  title,
  value,
  description,
  children,
}: {
  title?: string
  value?: string
  description?: string
  children?: React.ReactNode
}) => (
  <div className="stat p-1 pl-3">
    <div className="stat-title">{title}</div>
    <div className="stat-value mb-2">
      <div>{value}</div>
      {children}
    </div>
    <div className="stat-desc">{description}</div>
  </div>
)

export default Stat
