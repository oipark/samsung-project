/**
 * 테이블 컴포넌트 - Figma 디자인 시스템 기반
 * 사용: <Table><Table.Head><Table.Row><Table.Th>...</Table.Th></Table.Row></Table.Head><Table.Body>...</Table.Body></Table>
 */
import { tableStyles } from '../../theme/tokens'

const thClass = tableStyles.th
const tdClass = tableStyles.td

function Table({ children, className = '', minWidth, ...props }) {
  return (
    <table
      className={`w-full text-left ${className}`}
      style={minWidth ? { minWidth } : undefined}
      {...props}
    >
      {children}
    </table>
  )
}

function Head({ children, ...props }) {
  return <thead {...props}>{children}</thead>
}

function Body({ children, ...props }) {
  return <tbody {...props}>{children}</tbody>
}

function Row({ children, ...props }) {
  return <tr {...props}>{children}</tr>
}

function Th({ children, className = '', style, ...props }) {
  return (
    <th className={`${thClass} ${className}`.trim()} style={style} {...props}>
      {children}
    </th>
  )
}

function Td({ children, className = '', style, ...props }) {
  return (
    <td className={`${tdClass} ${className}`.trim()} style={style} {...props}>
      {children}
    </td>
  )
}

Table.Head = Head
Table.Body = Body
Table.Row = Row
Table.Th = Th
Table.Td = Td

export default Table
