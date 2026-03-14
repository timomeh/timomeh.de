type Props = React.DetailedHTMLProps<
  React.VideoHTMLAttributes<HTMLVideoElement>,
  HTMLVideoElement
>

export function Video(props: Props) {
  return (
    <div className="md:-mx-4">
      {/* oxlint-disable-next-line jsx_a11y/media-has-caption */}
      <video {...props} className="mx-auto my-0 rounded-md" />
    </div>
  )
}
