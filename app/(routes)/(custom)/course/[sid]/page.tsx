import CourseLecturePage from '@/components/CoursePage'
import React from 'react'

export default async function Page({
  params,
}: {
  params: Promise<{ sid: string }>;
}) {
  const resolvedParams = await params;
  const shareId = resolvedParams.sid;

  return (
    <div>
      <CourseLecturePage shareId={shareId} />
    </div>
  )
}
