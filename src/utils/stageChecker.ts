import { RouteLocationNormalized } from 'vue-router'

export type Stage = 'song' | 'search' | 'chapter' | 'main'

// TODO: Use route.pathMatch for this.
export default function getStage(route: RouteLocationNormalized): Stage {
  if (route.params.songId !== undefined && route.params.chapterId !== undefined) { return 'song' } else if (route.params.cid !== undefined) { return 'chapter' } else if (route.params.query !== undefined) { return 'search' } else { return 'main' }
}
