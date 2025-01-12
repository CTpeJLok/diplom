const Checkbox = ({ checked, onChange }) => {
  return (
    <div
      className='checkbox'
      onClick={onChange}>
      {checked && <div />}
    </div>
  )
}

export default Checkbox
