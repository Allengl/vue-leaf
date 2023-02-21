import { Dialog } from 'vant'
import { defineComponent, onMounted, PropType, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useMeStore } from '../stores/useMeStore'
import { Icon } from './Icon'
import s from './Overlay.module.scss'


export type Active = 'home' | 'statistics' | 'export' | 'notify'

export const Overlay = defineComponent({
  props: {
    onClose: {
      type: Function as PropType<() => void>,
    },
    active: {
      type: String as PropType<Active>,
    },
  },
  setup: (props) => {
    const { active } = props
    const meStore = useMeStore()
    const close = () => {
      props.onClose?.()
    }
    const route = useRoute()
    const me = ref<User>()
    onMounted(async () => {
      const response = await meStore.mePromise
      me.value = response?.data.resource
    })
    const onSignOut = async () => {
      await Dialog.confirm({
        title: '确认',
        message: '你真的要退出登录吗？',
      })
      localStorage.removeItem('jwt')
      window.location.reload()
    }
    return () => (
      <>
        <div class={s.mask} onClick={close}></div>
        <div class={s.overlay}>
          <section class={s.currentUser}>
            {me.value ? (
              <div>
                <h2 class={s.email}>{me.value.email}</h2>
                <p onClick={onSignOut}>点击这里退出登录</p>
              </div>
            ) : (
              <RouterLink to={`/sign_in?return_to=${route.fullPath}`}>
                <h2>未登录用户</h2>
                <p>点击这里登录</p>
              </RouterLink>
            )}
          </section>
          <nav>
            <ul class={s.action_list}>
              <li>
                <RouterLink to="/items" class={active == 'home' ? s.action__active : s.action}>
                  <Icon name="home" class={s.icon} />
                  <span>记账页面</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/statistics" class={active == 'statistics' ? s.action__active : s.action}>
                  <Icon name="charts" class={s.icon} />
                  <span>统计图表</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/export" class={active == 'export' ? s.action__active : s.action}>
                  <Icon name="export" class={s.icon} />
                  <span>导出数据</span>
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/notify" class={active == 'notify' ? s.action__active : s.action}>
                  <Icon name="notify" class={s.icon} />
                  <span>记账提醒</span>
                </RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </>
    )
  },
})

export const OverlayIcon = defineComponent({
  setup: () => {
    const refOverlayVisible = ref(false)
    const onClickMenu = () => {
      refOverlayVisible.value = !refOverlayVisible.value
    }
    // 根据 url 不同，显示不同的 active
    const route = useRoute()
    const active = ref<String>()

    const routeTable: Record<string, string> = {
      '/items': 'home',
      '/statistics': 'statistics',
      '/export': 'export',
      '/notify': 'notify',
    }

    onMounted(() => {
      active.value = routeTable[route.path]
    })

    return () => (
      <>
        <Icon name="menu" class={s.icon} onClick={onClickMenu} />
        {refOverlayVisible.value && (
          <Overlay
            active={active.value as Active}
            onClose={() => (refOverlayVisible.value = false)} />
        )}
      </>
    )
  },
})
