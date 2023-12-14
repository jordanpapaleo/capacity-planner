export type Change = React.ChangeEvent<HTMLInputElement>

const Input = (
  {
    onChange,
    placeholder,
    type = 'text',
    value,
  }: {
    onChange: (R: Change) => void
    placeholder?: string
    type?: 'text' | 'number'
    value: string | number
  }
) => (
  <input
    className="input input-bordered w-full max-w-xs"
    max="10"
    min="0"
    placeholder={placeholder}
    onChange={onChange}
    type={type}
    value={value}
  />
)

export default Input
