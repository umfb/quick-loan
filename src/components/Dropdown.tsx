export default function Dropdown({ array }: { array: Array<string> }) {
  return (
    <ul role="listbox">
      {array.map((item, index) => (
        <li>{item}</li>
      ))}
    </ul>
  );
}
