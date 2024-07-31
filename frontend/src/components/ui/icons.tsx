'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

export function AwardIcon1(props) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M7.967 14.722L7 22l4.588-2.753c.15-.09.225-.135.305-.152a.5.5 0 01.214 0c.08.017.155.062.305.152L17 22l-.966-7.279M19 9A7 7 0 115 9a7 7 0 0114 0z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AwardIcon2(props) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M7 15.09V22l4.703-1.881c.11-.044.165-.066.221-.075a.5.5 0 01.152 0c.056.009.111.03.221.075L17 22v-6.91m2.5-5.59a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function SearchIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" h-4 w-4"
    >
      <path
        {...props}
        d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AwardIcon3(props) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M7.869 15.46L7 22l4.588-2.753c.15-.09.225-.135.305-.152a.5.5 0 01.214 0c.08.017.155.062.305.152L17 22l-.868-6.543m.294-11.208c.154.373.45.67.824.825l1.309.542a1.525 1.525 0 01.825 1.992l-.542 1.308a1.522 1.522 0 000 1.168l.542 1.307a1.525 1.525 0 01-.826 1.993l-1.308.542c-.373.154-.67.45-.825.824l-.542 1.309a1.524 1.524 0 01-1.992.825l-1.308-.542a1.525 1.525 0 00-1.166 0l-1.31.542a1.524 1.524 0 01-1.99-.824l-.542-1.31a1.524 1.524 0 00-.824-.825l-1.31-.542a1.524 1.524 0 01-.825-1.991l.542-1.308a1.525 1.525 0 000-1.167l-.542-1.31a1.525 1.525 0 01.826-1.992l1.307-.542c.374-.154.67-.45.825-.823l.543-1.309a1.524 1.524 0 011.991-.825l1.308.542c.374.154.793.154 1.167-.001l1.31-.54a1.525 1.525 0 011.99.825l.543 1.31v-.003z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AwardIcon4(props) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      // xmlns="http://www.w3.org/2000/svg"
    >
      <path
        {...props}
        d="M8.876 13.095L4.701 7.877c-.26-.325-.39-.488-.482-.669a2 2 0 01-.178-.507C4 6.5 4 6.294 4 5.878V5.2c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C5.52 2 6.08 2 7.2 2h9.6c1.12 0 1.68 0 2.108.218a2 2 0 01.874.874C20 3.52 20 4.08 20 5.2v.678c0 .416 0 .624-.04.823a2.002 2.002 0 01-.179.507c-.092.181-.222.344-.482.669l-4.175 5.218M5 3l7 9 7-9m-3.464 10.464a5 5 0 11-7.071 7.071 5 5 0 017.07-7.07z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AsteriskIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        {...props}
        d="M12 2v20m7.071-17.071L4.93 19.07M22 12H2m17.071 7.071L4.93 4.93"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function TestIcon(props) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M9 6v4.501c0 .551 0 .827-.069 1.082a2 2 0 01-.295.631c-.153.216-.364.393-.787.745L4.15 16.041c-.423.352-.634.529-.787.745a2 2 0 00-.295.631C3 17.672 3 17.947 3 18.5v.301c0 1.12 0 1.68.218 2.108a2 2 0 00.874.874C4.52 22 5.08 22 6.2 22h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 00.874-.874C21 20.48 21 19.92 21 18.8v-.301c0-.551 0-.827-.069-1.082-.06-.226-.16-.44-.295-.631-.153-.216-.364-.393-.787-.745l-3.698-3.082c-.423-.352-.634-.528-.787-.745a1.999 1.999 0 01-.295-.631C15 11.328 15 11.053 15 10.5V6M8.3 6h7.4c.28 0 .42 0 .527-.054a.5.5 0 00.218-.219c.055-.107.055-.247.055-.527V2.8c0-.28 0-.42-.055-.527a.5.5 0 00-.218-.219C16.12 2 15.98 2 15.7 2H8.3c-.28 0-.42 0-.527.054a.5.5 0 00-.218.219C7.5 2.38 7.5 2.52 7.5 2.8v2.4c0 .28 0 .42.054.527a.5.5 0 00.219.218C7.88 6 8.02 6 8.3 6zM5.5 17h13c.465 0 .697 0 .89.038a2 2 0 011.572 1.572c.038.193.038.425.038.89s0 .697-.038.89a2 2 0 01-1.572 1.572c-.193.038-.425.038-.89.038h-13c-.465 0-.697 0-.89-.038a2 2 0 01-1.572-1.572C3 20.197 3 19.965 3 19.5s0-.697.038-.89a2 2 0 011.572-1.572C4.803 17 5.035 17 5.5 17z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function RewindIcon(props) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M22 16.437c0 1.13 0 1.695-.229 1.972a1 1 0 01-.809.363c-.358-.013-.78-.388-1.625-1.14l-4.992-4.436c-.465-.414-.698-.62-.784-.865a1 1 0 010-.662c.086-.245.319-.451.784-.865l4.992-4.437c.844-.75 1.267-1.126 1.625-1.14a1 1 0 01.81.364c.228.277.228.842.228 1.972v8.874zM11 16.437c0 1.13 0 1.695-.229 1.972a1 1 0 01-.809.363c-.358-.013-.78-.388-1.625-1.14l-4.992-4.436c-.465-.414-.698-.62-.784-.865a1 1 0 010-.662c.086-.245.319-.451.784-.865l4.992-4.437c.844-.75 1.267-1.126 1.625-1.14a1 1 0 01.81.364c.228.277.228.842.228 1.972v8.874z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PauseIcon(props) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M9.5 15V9m5 6V9m7.5 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StarAIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        {...props}
        d="M6.5 13l.784 1.569c.266.53.399.796.576 1.026a3 3 0 00.545.545c.23.177.495.31 1.026.575L11 17.5l-1.569.785c-.53.265-.796.398-1.026.575a3 3 0 00-.545.545c-.177.23-.31.495-.576 1.026L6.5 22l-.784-1.569c-.266-.53-.399-.796-.576-1.026a3 3 0 00-.545-.545c-.23-.177-.495-.31-1.026-.575L2 17.5l1.569-.785c.53-.265.796-.398 1.026-.575a3 3 0 00.545-.545c.177-.23.31-.495.576-1.026L6.5 13zM15 2l1.179 3.064c.282.734.423 1.1.642 1.409a3 3 0 00.706.706c.309.22.675.36 1.409.642L22 9l-3.064 1.179c-.734.282-1.1.423-1.409.642a3 3 0 00-.706.706c-.22.309-.36.675-.642 1.409L15 16l-1.179-3.064c-.282-.734-.423-1.1-.642-1.409a3 3 0 00-.706-.706c-.309-.22-.675-.36-1.409-.642L8 9l3.064-1.179c.734-.282 1.1-.423 1.409-.642a3 3 0 00.706-.706c.22-.309.36-.675.642-1.409L15 2z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconNextChat({
  className,
  inverted,
  ...props
}: React.ComponentProps<'svg'> & { inverted?: boolean }) {
  const id = React.useId()

  return (
    <svg
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <defs>
        <linearGradient
          id={`gradient-${id}-1`}
          x1="10.6889"
          y1="10.3556"
          x2="13.8445"
          y2="14.2667"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={inverted ? 'white' : 'black'} />
          <stop offset={1} stopColor={inverted ? 'white' : 'black'} stopOpacity={0} />
        </linearGradient>
        <linearGradient
          id={`gradient-${id}-2`}
          x1="11.7555"
          y1="4.8"
          x2="11.7376"
          y2="9.50002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={inverted ? 'white' : 'black'} />
          <stop offset={1} stopColor={inverted ? 'white' : 'black'} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path
        d="M1 16L2.58314 11.2506C1.83084 9.74642 1.63835 8.02363 2.04013 6.39052C2.4419 4.75741 3.41171 3.32057 4.776 2.33712C6.1403 1.35367 7.81003 0.887808 9.4864 1.02289C11.1628 1.15798 12.7364 1.8852 13.9256 3.07442C15.1148 4.26363 15.842 5.83723 15.9771 7.5136C16.1122 9.18997 15.6463 10.8597 14.6629 12.224C13.6794 13.5883 12.2426 14.5581 10.6095 14.9599C8.97637 15.3616 7.25358 15.1692 5.74942 14.4169L1 16Z"
        fill={inverted ? 'black' : 'white'}
        stroke={inverted ? 'black' : 'white'}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <mask
        id="mask0_91_2047"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x={1}
        y={0}
        width={16}
        height={16}
      >
        <circle cx={9} cy={8} r={8} fill={inverted ? 'black' : 'white'} />
      </mask>
      <g mask="url(#mask0_91_2047)">
        <circle cx={9} cy={8} r={8} fill={inverted ? 'black' : 'white'} />
        <path
          d="M14.2896 14.0018L7.146 4.8H5.80005V11.1973H6.87681V6.16743L13.4444 14.6529C13.7407 14.4545 14.0231 14.2369 14.2896 14.0018Z"
          fill={`url(#gradient-${id}-1)`}
        />
        <rect x="11.2222" y="4.8" width="1.06667" height="6.4" fill={`url(#gradient-${id}-2)`} />
      </g>
    </svg>
  )
}

function IconOpenAI({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <title>OpenAI icon</title>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  )
}

function Loading({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path
        d="M12 2.25v2.5M12 18v4M5.75 12h-3.5m19 0h-1.5m-1.293 6.457l-.707-.707m.914-12.334L17.25 6.83M4.922 19.078L7.75 16.25M5.129 5.209L7.25 7.33"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconVercel({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      aria-label="Vercel logomark"
      role="img"
      viewBox="0 0 74 64"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M37.5896 0.25L74.5396 64.25H0.639648L37.5896 0.25Z" fill="currentColor"></path>
    </svg>
  )
}

function IconGitHub({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <title>GitHub</title>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function IconSeparator({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="none"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M16.88 3.549L7.12 20.451"></path>
    </svg>
  )
}

function IconArrowDown({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="m205.66 149.66-72 72a8 8 0 0 1-11.32 0l-72-72a8 8 0 0 1 11.32-11.32L120 196.69V40a8 8 0 0 1 16 0v156.69l58.34-58.35a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

function IconArrowRight({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="m221.66 133.66-72 72a8 8 0 0 1-11.32-11.32L196.69 136H40a8 8 0 0 1 0-16h156.69l-58.35-58.34a8 8 0 0 1 11.32-11.32l72 72a8 8 0 0 1 0 11.32Z" />
    </svg>
  )
}

function IconUser({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z" />
    </svg>
  )
}

function IconPlus({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M224 128a8 8 0 0 1-8 8h-80v80a8 8 0 0 1-16 0v-80H40a8 8 0 0 1 0-16h80V40a8 8 0 0 1 16 0v80h80a8 8 0 0 1 8 8Z" />
    </svg>
  )
}

function IconArrowElbow({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M200 32v144a8 8 0 0 1-8 8H67.31l34.35 34.34a8 8 0 0 1-11.32 11.32l-48-48a8 8 0 0 1 0-11.32l48-48a8 8 0 0 1 11.32 11.32L67.31 168H184V32a8 8 0 0 1 16 0Z" />
    </svg>
  )
}

function IconSpinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4 animate-spin', className)}
      {...props}
    >
      <path d="M232 128a104 104 0 0 1-208 0c0-41 23.81-78.36 60.66-95.27a8 8 0 0 1 6.68 14.54C60.15 61.59 40 93.27 40 128a88 88 0 0 0 176 0c0-34.73-20.15-66.41-51.34-80.73a8 8 0 0 1 6.68-14.54C208.19 49.64 232 87 232 128Z" />
    </svg>
  )
}

function IconMessage({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M216 48H40a16 16 0 0 0-16 16v160a15.84 15.84 0 0 0 9.25 14.5A16.05 16.05 0 0 0 40 240a15.89 15.89 0 0 0 10.25-3.78.69.69 0 0 0 .13-.11L82.5 208H216a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16ZM40 224Zm176-32H82.5a16 16 0 0 0-10.3 3.75l-.12.11L40 224V64h176Z" />
    </svg>
  )
}

function IconTrash({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M216 48h-40v-8a24 24 0 0 0-24-24h-48a24 24 0 0 0-24 24v8H40a8 8 0 0 0 0 16h8v144a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V64h8a8 8 0 0 0 0-16ZM96 40a8 8 0 0 1 8-8h48a8 8 0 0 1 8 8v8H96Zm96 168H64V64h128Zm-80-104v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Zm48 0v64a8 8 0 0 1-16 0v-64a8 8 0 0 1 16 0Z" />
    </svg>
  )
}

function IconRefresh({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M197.67 186.37a8 8 0 0 1 0 11.29C196.58 198.73 170.82 224 128 224c-37.39 0-64.53-22.4-80-39.85V208a8 8 0 0 1-16 0v-48a8 8 0 0 1 8-8h48a8 8 0 0 1 0 16H55.44C67.76 183.35 93 208 128 208c36 0 58.14-21.46 58.36-21.68a8 8 0 0 1 11.31.05ZM216 40a8 8 0 0 0-8 8v23.85C192.53 54.4 165.39 32 128 32c-42.82 0-68.58 25.27-69.66 26.34a8 8 0 0 0 11.3 11.34C69.86 69.46 92 48 128 48c35 0 60.24 24.65 72.56 40H168a8 8 0 0 0 0 16h48a8 8 0 0 0 8-8V48a8 8 0 0 0-8-8Z" />
    </svg>
  )
}

function IconStop({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm24-120h-48a8 8 0 0 0-8 8v48a8 8 0 0 0 8 8h48a8 8 0 0 0 8-8v-48a8 8 0 0 0-8-8Zm-8 48h-32v-32h32Z" />
    </svg>
  )
}

function IconSidebar({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16ZM40 56h40v144H40Zm176 144H96V56h120v144Z" />
    </svg>
  )
}

function IconMoon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M233.54 142.23a8 8 0 0 0-8-2 88.08 88.08 0 0 1-109.8-109.8 8 8 0 0 0-10-10 104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.09 103.09 0 0 0 62.52-20.88 104.84 104.84 0 0 0 37-52.91 8 8 0 0 0-1.98-7.98Zm-44.64 48.11A88 88 0 0 1 65.66 67.11a89 89 0 0 1 31.4-26A106 106 0 0 0 96 56a104.11 104.11 0 0 0 104 104 106 106 0 0 0 14.92-1.06 89 89 0 0 1-26.02 31.4Z" />
    </svg>
  )
}

function IconSun({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M120 40V16a8 8 0 0 1 16 0v24a8 8 0 0 1-16 0Zm72 88a64 64 0 1 1-64-64 64.07 64.07 0 0 1 64 64Zm-16 0a48 48 0 1 0-48 48 48.05 48.05 0 0 0 48-48ZM58.34 69.66a8 8 0 0 0 11.32-11.32l-16-16a8 8 0 0 0-11.32 11.32Zm0 116.68-16 16a8 8 0 0 0 11.32 11.32l16-16a8 8 0 0 0-11.32-11.32ZM192 72a8 8 0 0 0 5.66-2.34l16-16a8 8 0 0 0-11.32-11.32l-16 16A8 8 0 0 0 192 72Zm5.66 114.34a8 8 0 0 0-11.32 11.32l16 16a8 8 0 0 0 11.32-11.32ZM48 128a8 8 0 0 0-8-8H16a8 8 0 0 0 0 16h24a8 8 0 0 0 8-8Zm80 80a8 8 0 0 0-8 8v24a8 8 0 0 0 16 0v-24a8 8 0 0 0-8-8Zm112-88h-24a8 8 0 0 0 0 16h24a8 8 0 0 0 0-16Z" />
    </svg>
  )
}

function IconCopy({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M216 32H88a8 8 0 0 0-8 8v40H40a8 8 0 0 0-8 8v128a8 8 0 0 0 8 8h128a8 8 0 0 0 8-8v-40h40a8 8 0 0 0 8-8V40a8 8 0 0 0-8-8Zm-56 176H48V96h112Zm48-48h-32V88a8 8 0 0 0-8-8H96V48h112Z" />
    </svg>
  )
}

function IconCheck({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

function IconDownload({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M224 152v56a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16v-56a8 8 0 0 1 16 0v56h160v-56a8 8 0 0 1 16 0Zm-101.66 5.66a8 8 0 0 0 11.32 0l40-40a8 8 0 0 0-11.32-11.32L136 132.69V40a8 8 0 0 0-16 0v92.69l-26.34-26.35a8 8 0 0 0-11.32 11.32Z" />
    </svg>
  )
}

function IconClose({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
    </svg>
  )
}

function IconEdit({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
      />
    </svg>
  )
}

function IconShare({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="m237.66 106.35-80-80A8 8 0 0 0 144 32v40.35c-25.94 2.22-54.59 14.92-78.16 34.91-28.38 24.08-46.05 55.11-49.76 87.37a12 12 0 0 0 20.68 9.58c11-11.71 50.14-48.74 107.24-52V192a8 8 0 0 0 13.66 5.65l80-80a8 8 0 0 0 0-11.3ZM160 172.69V144a8 8 0 0 0-8-8c-28.08 0-55.43 7.33-81.29 21.8a196.17 196.17 0 0 0-36.57 26.52c5.8-23.84 20.42-46.51 42.05-64.86C99.41 99.77 127.75 88 152 88a8 8 0 0 0 8-8V51.32L220.69 112Z" />
    </svg>
  )
}

function IconUsers({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M117.25 157.92a60 60 0 1 0-66.5 0 95.83 95.83 0 0 0-47.22 37.71 8 8 0 1 0 13.4 8.74 80 80 0 0 1 134.14 0 8 8 0 0 0 13.4-8.74 95.83 95.83 0 0 0-47.22-37.71ZM40 108a44 44 0 1 1 44 44 44.05 44.05 0 0 1-44-44Zm210.14 98.7a8 8 0 0 1-11.07-2.33A79.83 79.83 0 0 0 172 168a8 8 0 0 1 0-16 44 44 0 1 0-16.34-84.87 8 8 0 1 1-5.94-14.85 60 60 0 0 1 55.53 105.64 95.83 95.83 0 0 1 47.22 37.71 8 8 0 0 1-2.33 11.07Z" />
    </svg>
  )
}

function IconExternalLink({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M224 104a8 8 0 0 1-16 0V59.32l-66.33 66.34a8 8 0 0 1-11.32-11.32L196.68 48H152a8 8 0 0 1 0-16h64a8 8 0 0 1 8 8Zm-40 24a8 8 0 0 0-8 8v72H48V80h72a8 8 0 0 0 0-16H48a16 16 0 0 0-16 16v128a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16v-72a8 8 0 0 0-8-8Z" />
    </svg>
  )
}

function IconChevronUpDown({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={cn('h-4 w-4', className)}
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M181.66 170.34a8 8 0 0 1 0 11.32l-48 48a8 8 0 0 1-11.32 0l-48-48a8 8 0 0 1 11.32-11.32L128 212.69l42.34-42.35a8 8 0 0 1 11.32 0Zm-96-84.68L128 43.31l42.34 42.35a8 8 0 0 0 11.32-11.32l-48-48a8 8 0 0 0-11.32 0l-48 48a8 8 0 0 0 11.32 11.32Z" />
    </svg>
  )
}

function SquareIcon(props) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      // fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        {...props}
        d="M3 7.8c0-1.68 0-2.52.327-3.162a3 3 0 011.311-1.311C5.28 3 6.12 3 7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 011.311 1.311C21 5.28 21 6.12 21 7.8v8.4c0 1.68 0 2.52-.327 3.162a3 3 0 01-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 01-1.311-1.311C3 18.72 3 17.88 3 16.2V7.8z"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function CircleIcon(props) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function TriangleIcon(props) {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M2.39 18.098l8.225-14.206c.455-.785.682-1.178.979-1.31a1 1 0 01.812 0c.297.132.524.525.978 1.31l8.225 14.206c.456.788.685 1.182.65 1.506a1 1 0 01-.406.705c-.263.191-.718.191-1.628.191H3.775c-.91 0-1.366 0-1.629-.191a1 1 0 01-.406-.705c-.034-.324.194-.718.65-1.506z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
function CircleGeoIcon(props) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      {' '}
      <g clipPath="url(#clip0_231_266)">
        {' '}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M131.721 18.3099C125.389 7.3642 113.554 0 100 0C86.4456 0 74.6111 7.3642 68.2794 18.3099H131.721ZM136.62 59.1549C136.62 38.9304 120.225 22.5352 100 22.5352C79.7755 22.5352 63.3803 38.9304 63.3803 59.1549L136.62 59.1549ZM63.3803 140.845C63.3803 161.07 79.7755 177.465 100 177.465C120.225 177.465 136.62 161.07 136.62 140.845H63.3803ZM177.465 100C177.465 120.225 161.07 136.62 140.845 136.62V63.3803C161.07 63.3803 177.465 79.7755 177.465 100ZM59.1549 63.3803C38.9304 63.3803 22.5352 79.7755 22.5352 100C22.5352 120.225 38.9304 136.62 59.1549 136.62L59.1549 63.3803ZM100 136.62C120.225 136.62 136.62 120.225 136.62 100C136.62 79.7755 120.225 63.3803 100 63.3803C79.7755 63.3803 63.3803 79.7755 63.3803 100C63.3803 120.225 79.7755 136.62 100 136.62ZM200 100.031C200 113.585 192.636 125.419 181.69 131.751V68.3099C192.636 74.6416 200 86.476 200 100.031ZM18.3099 68.3097C7.3642 74.6414 2.68548e-06 86.4759 0 100.03C0 113.585 7.3642 125.419 18.3099 131.751V68.3097ZM100.031 200C86.476 200 74.6416 192.636 68.3099 181.69H131.751C125.419 192.636 113.585 200 100.031 200ZM140.845 59.1549L177.465 59.1549C177.465 38.9304 161.07 22.5352 140.845 22.5352V59.1549ZM140.845 177.465L140.845 140.845H177.465C177.465 161.07 161.07 177.465 140.845 177.465ZM59.1549 140.845L22.5352 140.845C22.5352 161.07 38.9304 177.465 59.1549 177.465L59.1549 140.845ZM59.1549 22.5352L59.1549 59.1549L22.5352 59.1549C22.5352 38.9304 38.9304 22.5352 59.1549 22.5352Z"
          fill="url(#paint0_linear_231_266)"
        />{' '}
      </g>{' '}
      <defs>
        {' '}
        <linearGradient
          id="paint0_linear_231_266"
          x1="27.5"
          y1="19"
          x2="149"
          y2="174.5"
          gradientUnits="userSpaceOnUse"
        >
          {' '}
          <stop stopColor="#4d4841" /> <stop offset="1" stopColor="#726a5c" />{' '}
        </linearGradient>{' '}
        <clipPath id="clip0_231_266">
          {' '}
          <rect width="200" height="200" fill="white" />{' '}
        </clipPath>{' '}
      </defs>{' '}
    </svg>
  )
}
function TriangleGeoIcon(props) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      {' '}
      <g clipPath="url(#clip0_105_323)">
        {' '}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M106.973 87.6003C103.915 93.0385 96.0852 93.0385 93.027 87.6003L50.4686 11.9213C47.4696 6.58851 51.3234 7.97602e-06 57.4416 5.67316e-06L142.558 0C148.677 -5.34872e-07 152.53 6.58849 149.531 11.9213L106.973 87.6003ZM87.6003 106.973C93.0385 103.915 93.0385 96.0851 87.6003 93.0269L11.9213 50.4685C6.58848 47.4696 -1.12708e-05 51.3233 -1.15382e-05 57.4415L-1.52588e-05 142.558C-1.55262e-05 148.677 6.58849 152.53 11.9213 149.531L87.6003 106.973ZM106.973 112.4C103.915 106.961 96.0852 106.962 93.027 112.4L50.4686 188.079C47.4697 193.412 51.3234 200 57.4416 200H142.558C148.677 200 152.53 193.411 149.531 188.079L106.973 112.4ZM112.4 93.027C106.961 96.0853 106.961 103.915 112.4 106.973L188.079 149.531C193.412 152.53 200 148.677 200 142.558V57.4417C200 51.3235 193.411 47.4697 188.079 50.4687L112.4 93.027Z"
          fill="url(#paint0_linear_105_323)"
        />{' '}
      </g>{' '}
      <defs>
        {' '}
        <linearGradient
          id="paint0_linear_105_323"
          x1="100"
          y1="0"
          x2="100"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          {' '}
          <stop stopColor="#4d4841" /> <stop offset="1" stopColor="#726a5c" />{' '}
        </linearGradient>{' '}
        <clipPath id="clip0_105_323">
          {' '}
          <rect width="200" height="200" fill="white" />{' '}
        </clipPath>{' '}
      </defs>{' '}
    </svg>
  )
}
function SquareGeoIcon(props) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      className=""
      {...props}
    >
      {' '}
      <g clipPath="url(#clip0_105_666)">
        {' '}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M100 22C100 9.84974 90.1503 0 78 0H22C9.84974 0 0 9.84972 0 22V78.7194C0 90.8697 9.84974 100.719 22 100.719H78C90.1503 100.719 100 110.569 100 122.719V178C100 190.15 109.85 200 122 200H178C190.15 200 200 190.15 200 178V121.28C200 109.13 190.15 99.2805 178 99.2805H122C109.85 99.2805 100 89.4308 100 77.2805V22Z"
          fill="url(#paint0_linear_105_666)"
        />{' '}
      </g>{' '}
      {/* <defs className=" ">
        {' '}
        <linearGradient
          id="paint0_linear_105_666"
          x1="14"
          y1="26"
          x2="179"
          y2="179.5"
          gradientUnits="userSpaceOnUse"
        >
          {' '}
          <stop stopColor="#4d4841" /> <stop offset="1" stopColor="#726a5c" />{' '}
        </linearGradient>{' '}
        <clipPath id="clip0_105_666">
          {' '}
          <rect width="200" height="200" fill="white" />{' '}
        </clipPath>{' '}
      </defs>{' '} */}
      <defs className="">
        {' '}
        <linearGradient
          id="paint0_linear_105_666"
          x1="14"
          y1="26"
          x2="179"
          y2="179.5"
          gradientUnits="userSpaceOnUse"
        >
          {' '}
          <stop stopColor="#4d4841" /> <stop offset="1" stopColor="#726a5c" />{' '}
        </linearGradient>{' '}
        <clipPath id="clip0_105_666">
          {' '}
          <rect width="200" height="200" fill="white" />{' '}
        </clipPath>{' '}
      </defs>{' '}
    </svg>
  )
}

function FlashCardIcon(props) {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M2 5.2c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C3.52 2 4.08 2 5.2 2h7.6c1.12 0 1.68 0 2.108.218a2 2 0 01.874.874C16 3.52 16 4.08 16 5.2v7.6c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C14.48 16 13.92 16 12.8 16H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874C2 14.48 2 13.92 2 12.8V5.2z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        {...props}
        d="M8 11.2c0-1.12 0-1.68.218-2.108a2 2 0 01.874-.874C9.52 8 10.08 8 11.2 8h7.6c1.12 0 1.68 0 2.108.218a2 2 0 01.874.874C22 9.52 22 10.08 22 11.2v7.6c0 1.12 0 1.68-.218 2.108a2 2 0 01-.874.874C20.48 22 19.92 22 18.8 22h-7.6c-1.12 0-1.68 0-2.108-.218a2 2 0 01-.874-.874C8 20.48 8 19.92 8 18.8v-7.6z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function QuizIcon(props) {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M14.5 5.5L16 7m-4.5 1.5L13 10m-4.5 1.5L10 13m-4.5 1.5L7 16m-4.434 1.566l3.868 3.868c.198.198.297.297.411.334.1.033.209.033.31 0 .114-.037.213-.136.41-.334l13.87-13.868c.197-.198.296-.297.333-.412a.499.499 0 000-.309c-.037-.114-.136-.213-.334-.41l-3.868-3.87c-.198-.197-.297-.296-.412-.333a.5.5 0 00-.309 0c-.114.037-.213.136-.41.334L2.564 16.434c-.197.198-.296.297-.333.411a.5.5 0 000 .31c.037.114.136.213.334.41z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TelescopeIcon(props) {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M13.122 14.845L18 22m-7.121-7.155L6 22m8-8.8a2 2 0 11-4 0 2 2 0 014 0zm3.149-8.668L5.365 7.69c-.27.072-.406.109-.495.189a.5.5 0 00-.155.267c-.025.118.011.253.084.524l.88 3.284c.072.27.109.405.189.495a.5.5 0 00.268.154c.117.025.252-.011.523-.083l11.784-3.158-1.294-4.83zM21.793 9.5c-1.082.29-1.623.434-2.093.335a2 2 0 01-1.07-.618c-.322-.357-.466-.898-.756-1.98l-.156-.58c-.29-1.082-.434-1.623-.335-2.092a2 2 0 01.618-1.07c.357-.322.898-.467 1.98-.757.27-.072.406-.109.523-.084a.5.5 0 01.268.155c.08.09.116.224.189.495l1.398 5.216c.072.27.108.406.083.523a.5.5 0 01-.154.268c-.09.08-.225.116-.495.189zm-18.29 2.83l1.351-.362c.27-.073.406-.11.495-.19a.5.5 0 00.155-.267c.025-.117-.011-.253-.084-.523l-.362-1.352c-.073-.27-.109-.406-.19-.495a.5.5 0 00-.267-.155c-.117-.025-.253.011-.523.084l-1.352.362c-.27.073-.406.109-.495.19a.5.5 0 00-.155.267c-.025.117.011.253.084.523l.362 1.352c.073.27.109.406.19.495a.5.5 0 00.267.155c.117.025.253-.011.523-.084z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlusIcon2(props) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M12 5v14m-7-7h14"
        stroke="#000"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function NotesIcon(props) {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M21 18l-1 1.094A2.71 2.71 0 0118 20c-.75 0-1.47-.326-2-.906a2.716 2.716 0 00-2-.904c-.75 0-1.469.325-2 .904M3 20h1.675c.489 0 .733 0 .964-.055.204-.05.399-.13.578-.24.201-.123.374-.296.72-.642L19.5 6.5a2.121 2.121 0 00-3-3L3.937 16.063c-.346.346-.519.519-.642.72a2 2 0 00-.24.578c-.055.23-.055.475-.055.965V20z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RocketIcon(props) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" className="mr-2">
      <path
        {...props}
        d="M12 15l-3-3m3 3a22.355 22.355 0 004-2m-4 2v5s3.03-.55 4-2c1.08-1.62 0-5 0-5m-7-1a21.999 21.999 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11m-7-1H4s.55-3.03 2-4c1.62-1.08 5 0 5 0m-6.5 8.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ShareIcon(props) {
  return (
    <svg
      width={21}
      height={21}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        {...props}
        d="M21 9V3m0 0h-6m6 0l-8 8m-3-6H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C3 7.28 3 8.12 3 9.8v6.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C5.28 21 6.12 21 7.8 21h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C19 18.72 19 17.88 19 16.2V14"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TagIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 "
    >
      <path
        {...props}
        d="M8 8h.01M2 5.2v4.475c0 .489 0 .733.055.963.05.204.13.4.24.579.123.201.296.374.642.72l7.669 7.669c1.188 1.188 1.782 1.782 2.467 2.004a3 3 0 001.854 0c.685-.222 1.28-.816 2.467-2.004l2.212-2.212c1.188-1.188 1.782-1.782 2.004-2.467a3 3 0 000-1.854c-.222-.685-.816-1.28-2.004-2.467l-7.669-7.669c-.346-.346-.519-.519-.72-.642a2.001 2.001 0 00-.579-.24C10.409 2 10.165 2 9.676 2H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C2 3.52 2 4.08 2 5.2zM8.5 8a.5.5 0 11-1 0 .5.5 0 011 0z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PlusIcon(props: any) {
  return (
    <svg
      width={22}
      height={22}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" h-[1.1rem] w-[1.1rem]"
    >
      <path
        {...props}
        d="M12 5v14m-7-7h14"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MapIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        {...props}
        d="M8 3l8 18M3 17l9-5m-4.2 9h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C21 18.72 21 17.88 21 16.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C18.72 3 17.88 3 16.2 3H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C5.28 21 6.12 21 7.8 21z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FilterIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        {...props}
        d="M2 4.6c0-.56 0-.84.109-1.054a1 1 0 01.437-.437C2.76 3 3.04 3 3.6 3h16.8c.56 0 .84 0 1.054.109a1 1 0 01.437.437C22 3.76 22 4.04 22 4.6v.67c0 .268 0 .403-.033.528-.029.11-.077.215-.141.31-.073.106-.175.194-.378.37l-6.396 5.543c-.203.176-.305.265-.377.371-.065.095-.113.2-.142.31-.033.125-.033.26-.033.529v5.227c0 .196 0 .294-.031.378a.5.5 0 01-.133.196c-.066.06-.157.096-.339.17l-3.4 1.36c-.367.146-.551.22-.699.189a.5.5 0 01-.315-.213c-.083-.126-.083-.324-.083-.72v-6.587c0-.27 0-.404-.033-.529a1.001 1.001 0 00-.141-.31c-.073-.106-.175-.194-.378-.37L2.552 6.478c-.203-.177-.305-.265-.378-.371a1 1 0 01-.141-.31C2 5.673 2 5.538 2 5.269V4.6z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CultIcon(props) {
  return (
    <svg
      width={260}
      height={478}
      viewBox="0 0 260 478"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        className="dark:fill-brand-500 fill-neutral-900"
        d="M130 216.896c-23.894 0-43.333-19.439-43.333-43.333S106.106 130.23 130 130.23s43.333 19.439 43.333 43.333-19.439 43.333-43.333 43.333zm0 173.794c23.894 0 43.333 19.439 43.333 43.333S153.894 477.356 130 477.356s-43.333-19.439-43.333-43.333S106.106 390.69 130 390.69zm86.667-304.023c-23.895 0-43.334-19.44-43.334-43.334C173.333 19.44 192.772 0 216.667 0 240.561 0 260 19.439 260 43.333c0 23.895-19.439 43.334-43.333 43.334zm0 173.792c23.894 0 43.333 19.439 43.333 43.334 0 23.894-19.439 43.333-43.333 43.333-23.895 0-43.334-19.439-43.334-43.333 0-23.895 19.439-43.334 43.334-43.334zM43.333 86.667C19.44 86.667 0 67.227 0 43.333 0 19.44 19.439 0 43.333 0c23.895 0 43.334 19.439 43.334 43.333 0 23.895-19.44 43.334-43.334 43.334zm0 173.792c23.895 0 43.334 19.439 43.334 43.334 0 23.894-19.44 43.333-43.334 43.333C19.44 347.126 0 327.687 0 303.793c0-23.895 19.439-43.334 43.333-43.334z"
        fill="#000"
      />
    </svg>
  )
}

enum Status {
  Idle = 'idle',
  Loading = 'loading',
  Complete = 'complete',
  Error = 'error',
}

interface StatusObject {
  status: Status
  error?: string
}

function PdfFileIcon(props) {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M7.75 4A3.25 3.25 0 0111 .75h16c.121 0 .238.048.323.134l10.793 10.793a.457.457 0 01.134.323v24A3.25 3.25 0 0135 39.25H11A3.25 3.25 0 017.75 36V4z"
        fill="#fff"
        stroke="#D0D5DD"
        strokeWidth={1.5}
      />
      <path d="M27 .5V8a4 4 0 004 4h7.5" stroke="#D0D5DD" strokeWidth={1.5} />
      <rect
        x={1}
        y={18}
        width={26}
        height={16}
        rx={2}
        fill="#D92D20"
        className="fill-brand-400 dark:fill-brand-400"
      />
      <path
        d="M4.832 30v-7.273h2.87c.551 0 1.021.106 1.41.316.388.209.684.499.887.87.206.37.31.796.31 1.279 0 .483-.105.909-.313 1.278-.209.37-.51.657-.906.863-.393.206-.869.309-1.427.309h-1.83V26.41h1.581c.296 0 .54-.051.732-.153.194-.104.338-.247.433-.43.097-.184.145-.396.145-.635 0-.242-.048-.452-.145-.632a.972.972 0 00-.433-.423c-.195-.102-.44-.153-.74-.153H6.37V30H4.832zm9.053 0h-2.578v-7.273h2.6c.73 0 1.36.146 1.889.437.527.289.934.704 1.218 1.246.286.543.43 1.191.43 1.947 0 .757-.144 1.408-.43 1.953a2.953 2.953 0 01-1.226 1.253c-.53.291-1.164.437-1.903.437zm-1.04-1.317h.976c.455 0 .837-.081 1.147-.242.313-.163.547-.415.703-.756.159-.344.238-.786.238-1.328 0-.538-.08-.977-.238-1.318a1.541 1.541 0 00-.7-.753c-.31-.16-.692-.241-1.146-.241h-.98v4.637zM18.581 30v-7.273h4.816v1.268H20.12v1.733h2.958v1.268H20.12V30h-1.538z"
        fill="#fff"
        className="fill-black dark:fill-stone-700"
      />
    </svg>
  )
}

function TxtFileIcon(props) {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M7.75 4A3.25 3.25 0 0111 .75h16c.121 0 .238.048.323.134l10.793 10.793a.457.457 0 01.134.323v24A3.25 3.25 0 0135 39.25H11A3.25 3.25 0 017.75 36V4z"
        fill="#fff"
        stroke="#D0D5DD"
        strokeWidth={1.5}
      />
      <path d="M27 .5V8a4 4 0 004 4h7.5" stroke="#D0D5DD" strokeWidth={1.5} />
      <rect
        x={1}
        y={18}
        width={27}
        height={16}
        rx={2}
        fill="#344054"
        className="fill-brand-400 dark:fill-brand-400"
      />
      <path
        d="M4.601 23.995v-1.268h5.973v1.268H8.348V30h-1.52v-6.005H4.6zM13 22.727l1.466 2.479h.057l1.474-2.479h1.736l-2.22 3.637L17.784 30h-1.768l-1.492-2.482h-.057L12.975 30h-1.762l2.277-3.636-2.234-3.637H13zm5.43 1.268v-1.268h5.972v1.268h-2.226V30h-1.52v-6.005h-2.227z"
        fill="#fff"
        className="fill-black dark:fill-stone-700"
      />
    </svg>
  )
}

function MdFileIcon(props) {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M35 39.25H11A3.25 3.25 0 017.75 36V4A3.25 3.25 0 0111 .75h16c.121 0 .238.048.323.134l10.793 10.793a.457.457 0 01.134.323v24A3.25 3.25 0 0135 39.25z"
        fill="#fff"
        stroke="#D0D5DD"
        strokeWidth={1.5}
      />
      <path d="M27 .5V8a4 4 0 004 4h7.5" stroke="#D0D5DD" strokeWidth={1.5} />
      <rect
        x={2.5}
        y={18}
        width={23}
        height={16}
        rx={2}
        fill="#099250"
        className="fill-brand-400 dark:fill-brand-400"
      />
      <path
        d="M6.42 22.727h1.896l2.002 4.887h.086l2.002-4.887h1.897V30H12.81v-4.734h-.06l-1.882 4.699H9.853l-1.882-4.716h-.06V30H6.419v-7.273zM18.147 30H15.57v-7.273h2.599c.732 0 1.361.146 1.89.437.527.289.933.704 1.217 1.246.287.543.43 1.191.43 1.947 0 .757-.143 1.408-.43 1.953a2.953 2.953 0 01-1.225 1.253c-.53.291-1.165.437-1.903.437zm-1.04-1.317h.976c.454 0 .837-.081 1.147-.242.312-.163.547-.415.703-.756.159-.344.238-.786.238-1.328 0-.538-.08-.977-.238-1.318a1.54 1.54 0 00-.7-.753c-.31-.16-.692-.241-1.147-.241h-.98v4.637z"
        fill="#fff"
        className="fill-black dark:fill-stone-700"
      />
    </svg>
  )
}

function DocXIcon(props) {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M7.75 4A3.25 3.25 0 0111 .75h16c.121 0 .238.048.323.134l10.793 10.793a.457.457 0 01.134.323v24A3.25 3.25 0 0135 39.25H11A3.25 3.25 0 017.75 36V4z"
        fill="#fff"
        stroke="#D0D5DD"
        strokeWidth={1.5}
      />
      <path d="M27 .5V8a4 4 0 004 4h7.5" stroke="#D0D5DD" strokeWidth={1.5} />
      <rect
        x={1}
        y={18}
        width={36}
        height={16}
        rx={2}
        fill="#155EEF"
        className="fill-brand-400 dark:fill-brand-400"
      />
      <path
        d="M7.406 30H4.827v-7.273h2.6c.731 0 1.361.146 1.89.437.527.289.933.704 1.217 1.246.286.543.43 1.191.43 1.947 0 .757-.144 1.408-.43 1.953a2.953 2.953 0 01-1.225 1.253c-.53.291-1.165.437-1.903.437zm-1.04-1.317h.976c.454 0 .837-.081 1.147-.242.312-.163.547-.415.703-.756.158-.344.238-.786.238-1.328 0-.538-.08-.977-.238-1.318a1.54 1.54 0 00-.7-.753c-.31-.16-.692-.241-1.147-.241h-.98v4.637zm12.42-2.32c0 .794-.15 1.468-.451 2.025a3.126 3.126 0 01-1.222 1.275 3.452 3.452 0 01-1.732.436 3.444 3.444 0 01-1.74-.44 3.135 3.135 0 01-1.219-1.275c-.298-.556-.447-1.23-.447-2.02 0-.794.15-1.468.447-2.024a3.11 3.11 0 011.218-1.272 3.444 3.444 0 011.74-.44c.642 0 1.22.147 1.733.44.517.291.924.715 1.222 1.271.3.557.451 1.232.451 2.025zm-1.559 0c0-.513-.077-.946-.23-1.3-.152-.352-.366-.62-.643-.802a1.73 1.73 0 00-.973-.273 1.73 1.73 0 00-.973.273c-.277.183-.493.45-.647.803-.151.353-.227.786-.227 1.3 0 .513.076.947.227 1.3.154.352.37.62.647.802.277.182.6.273.973.273.371 0 .695-.09.973-.273.277-.182.49-.45.642-.803.154-.352.231-.786.231-1.3zm9.115-1.09h-1.555a1.521 1.521 0 00-.174-.536 1.365 1.365 0 00-.338-.405 1.484 1.484 0 00-.476-.255 1.82 1.82 0 00-.578-.09c-.377 0-.705.094-.984.282-.28.184-.496.454-.65.81-.154.352-.23.78-.23 1.285 0 .518.076.954.23 1.306.156.353.374.62.653.8.28.18.603.27.97.27.206 0 .396-.028.572-.082a1.37 1.37 0 00.813-.625c.092-.152.156-.325.192-.519l1.555.007a2.9 2.9 0 01-.945 1.793 3.024 3.024 0 01-.958.576c-.37.14-.788.21-1.254.21-.649 0-1.229-.147-1.74-.44a3.126 3.126 0 01-1.207-1.276c-.294-.556-.44-1.23-.44-2.02 0-.794.148-1.468.447-2.024.298-.557.703-.98 1.214-1.272a3.403 3.403 0 011.726-.44c.421 0 .812.059 1.172.177.362.119.683.292.962.519.28.225.507.5.682.827.178.327.291.701.341 1.122zm2.388-2.546l1.467 2.479h.057l1.473-2.479h1.737l-2.22 3.637L33.514 30h-1.769l-1.491-2.482h-.057L28.705 30h-1.761l2.276-3.636-2.233-3.637h1.743z"
        fill="#fff"
        className="fill-black dark:fill-stone-700"
      />
    </svg>
  )
}

export function TrashIcon(props) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
    >
      <path
        {...props}
        d="M13.333 5v-.667c0-.933 0-1.4-.181-1.756a1.667 1.667 0 00-.729-.729c-.356-.181-.823-.181-1.756-.181H9.333c-.933 0-1.4 0-1.756.181-.314.16-.569.415-.729.729-.181.356-.181.823-.181 1.756V5m1.666 4.583v4.167m3.334-4.167v4.167M2.5 5h15m-1.667 0v9.333c0 1.4 0 2.1-.272 2.635a2.5 2.5 0 01-1.093 1.093c-.534.272-1.235.272-2.635.272H8.167c-1.4 0-2.1 0-2.635-.272a2.5 2.5 0 01-1.093-1.093c-.272-.534-.272-1.235-.272-2.635V5"
        stroke="#667085"
        strokeWidth={1.66667}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function DefaultFileIcon(props) {
  return (
    <svg width={40} height={40} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        {...props}
        d="M4.75 4A3.25 3.25 0 018 .75h16c.121 0 .238.048.323.134l10.793 10.793a.457.457 0 01.134.323v24A3.25 3.25 0 0132 39.25H8A3.25 3.25 0 014.75 36V4z"
        fill="#fff"
        stroke="#D0D5DD"
        strokeWidth={1.5}
      />
      <path d="M24 .5V8a4 4 0 004 4h7.5" stroke="#D0D5DD" strokeWidth={1.5} />
      <path
        d="M11.9 19.5h16.2m-16.2 3.6h16.2m-16.2 3.6h16.2m-16.2 3.6h12.6"
        stroke="#155EEF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FilePlusIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" h-7 w-7 "
    >
      <path
        {...props}
        d="M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 00.437.437c.214.11.494.11 1.054.11h4.13M12 18v-6m-3 3h6M14 2H8.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C4 4.28 4 5.12 4 6.8v10.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C6.28 22 7.12 22 8.8 22h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C20 19.72 20 18.88 20 17.2V8l-6-6z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
export function FileBlankIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className=" h-5 w-5 "
    >
      <path
        {...props}
        d="M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 00.437.437C14.76 8 15.04 8 15.6 8h4.13M20 9.988V17.2c0 1.68 0 2.52-.327 3.162a3 3 0 01-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 01-1.311-1.311C4 19.72 4 18.88 4 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 011.311-1.311C6.28 2 7.12 2 8.8 2h3.212c.733 0 1.1 0 1.446.083.306.073.598.195.867.36.303.185.562.444 1.08.963l3.19 3.188c.518.519.777.778.963 1.081a3 3 0 01.36.867c.082.346.082.712.082 1.446z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FolderIcon(props) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
    >
      <path
        {...props}
        d="M13 7l-1.116-2.231c-.32-.642-.481-.963-.72-1.198a2 2 0 00-.748-.462C10.1 3 9.74 3 9.022 3H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 00-.874.874C2 4.52 2 5.08 2 6.2V7m0 0h15.2c1.68 0 2.52 0 3.162.327a3 3 0 011.311 1.311C22 9.28 22 10.12 22 11.8v4.4c0 1.68 0 2.52-.327 3.162a3 3 0 01-1.311 1.311C19.72 21 18.88 21 17.2 21H6.8c-1.68 0-2.52 0-3.162-.327a3 3 0 01-1.311-1.311C2 18.72 2 17.88 2 16.2V7z"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function getFileIcon(file: any): JSX.Element {
  // Determine the file extension or use a mime-type library
  const extension = file?.path?.split('.').pop().toLowerCase()

  switch (extension) {
    case 'pdf':
      return <PdfFileIcon />
    case 'txt':
      return <TxtFileIcon />
    case 'md':
      return <MdFileIcon />
    case 'docx':
      return <DocXIcon />
    // Add more cases for other file types
    default:
      return <DefaultFileIcon /> // You should define this for unknown types
  }
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export {
  CultIcon,
  FilterIcon,
  MapIcon,
  PlusIcon,
  TagIcon,
  IconEdit,
  IconNextChat,
  IconOpenAI,
  IconVercel,
  IconGitHub,
  Loading,
  IconSeparator,
  IconArrowDown,
  IconArrowRight,
  IconUser,
  IconPlus,
  IconArrowElbow,
  IconSpinner,
  IconMessage,
  IconTrash,
  IconRefresh,
  IconStop,
  IconSidebar,
  IconMoon,
  IconSun,
  IconCopy,
  IconCheck,
  IconDownload,
  IconClose,
  IconShare,
  IconUsers,
  ShareIcon,
  IconExternalLink,
  IconChevronUpDown,
  TriangleIcon,
  CircleIcon,
  SquareIcon,
  SquareGeoIcon,
  TriangleGeoIcon,
  CircleGeoIcon,
  FlashCardIcon,
  QuizIcon,
  TelescopeIcon,
  PlusIcon2,
  NotesIcon,
  RocketIcon,
}
