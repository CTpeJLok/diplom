export const COMPONENTS = {
  table: ({ node, ...props }) => (
    <table
      {...props}
      className='table table-bordered table-striped mb-3'
    />
  ),
  ul: ({ node, ...props }) => (
    <ul
      {...props}
      className='list-group mb-3'
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      {...props}
      className='list-group mb-3'
    />
  ),
  li: ({ node, ...props }) => (
    <li
      {...props}
      className='list-group-item'
    />
  ),
  h1: ({ node, ...props }) => (
    <h1
      {...props}
      className='mt-3 mb-1'
    />
  ),
  h2: ({ node, ...props }) => (
    <h2
      {...props}
      className='mt-3 mb-1'
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      {...props}
      className='mt-3 mb-1'
    />
  ),
  h4: ({ node, ...props }) => (
    <h4
      {...props}
      className='mt-3 mb-1'
    />
  ),
  h5: ({ node, ...props }) => (
    <h5
      {...props}
      className='mt-3 mb-1'
    />
  ),
  h6: ({ node, ...props }) => (
    <h6
      {...props}
      className='mt-3 mb-1'
    />
  ),
}
