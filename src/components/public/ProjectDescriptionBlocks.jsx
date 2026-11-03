/**
 * Renders a project's description blocks on the public site.
 * Uses the new `descriptions[]` array with per-block headings.
 * Falls back to the legacy `description` string for old projects.
 */
export default function ProjectDescriptionBlocks({ project, className = '' }) {
  if (!project) return null

  const blocks =
    Array.isArray(project.descriptions) && project.descriptions.length > 0
      ? project.descriptions
      : project.description
        ? [{ heading: '', content: project.description }]
        : []

  if (blocks.length === 0) return null

  return (
    <div className={`space-y-5 ${className}`}>
      {blocks.map((block, i) => (
        <div key={i}>
          {block.heading && (
            <h3 className="text-lg sm:text-xl font-bold text-[#086B87] mb-2 font-inter">
              {block.heading}
            </h3>
          )}
          <div
            className="text-gray-600 leading-relaxed text-sm sm:text-base font-medium font-inter [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_h1]:font-bold [&_h2]:font-semibold [&_h3]:font-semibold [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_a]:text-[#0a85a7] [&_a]:underline [&_a]:hover:text-[#097390] [&_img]:rounded-lg [&_img]:my-3 [&_strong]:text-gray-800 [&_strong]:font-semibold [&_blockquote]:border-l-4 [&_blockquote]:border-[#0a85a7] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm"
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        </div>
      ))}
    </div>
  )
}