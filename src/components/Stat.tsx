// https://daisyui.com/components/stat/
const Stat = ({
  children,
  description,
  title,
  value,
}: {
  children?: React.ReactNode
  description?: string
  title?: string
  value?: string
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

export const ErrorStat = ({
  children,
  description,
  title,
  value,
}: {
  title?: string
  value?: string
  description?: string
  children?: React.ReactNode
}) => (
  <div className="stat p-1 pl-3 bg-error">
    <div className="stat-title text-base-100">{title}</div>
    <div className="stat-value mb-2 text-base-100">
      <div>{value}</div>
      {children}
    </div>
    <div className="stat-desc text-base-100">{description}</div>
  </div>
)

export default Stat
