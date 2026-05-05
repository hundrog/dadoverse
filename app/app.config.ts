export default defineAppConfig({
  ui: {
    colors: {
      primary: 'cyan',
      secondary: 'amber',
      neutral: 'slate'
    },
    pageCard: {
      variants: {
        variant: {
          solid: {
            root: 'bg-inverted text-inverted',
            title: 'text-inverted',
            description: 'text-dimmed'
          },
          outline: {
            root: 'bg-default ring ring-default',
            description: 'text-muted'
          },
          soft: {
            root: 'bg-elevated/50',
            description: 'text-toned'
          },
          subtle: {
            root: 'bg-elevated/50 ring ring-default',
            description: 'text-toned'
          },
          ghost: {
            description: 'text-muted'
          },
          naked: {
            container: 'p-0 sm:p-0',
            description: 'text-muted'
          },
          disabled: {
            root: 'bg-default ring ring-default',
            title: 'text-muted',
            description: 'text-muted',
            leadingIcon: 'text-muted'
          }
        }
      },
    }
  }
})
