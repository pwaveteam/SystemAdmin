import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const pretendard = localFont({
src: '../fonts/PretendardVariable.woff2',
variable: '--font-sans',
weight: '100 900',
display: 'swap',
})

export const metadata: Metadata = {
title: 'System Admin',
description: 'System Administration',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="ko" className={pretendard.variable}>
<body className="min-h-dvh font-sans">{children}</body>
</html>
)
}