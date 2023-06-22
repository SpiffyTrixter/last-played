<script>
  import dayjs from 'dayjs'

  export let format = 'YYYY-MM-DD HH:mm:ss'
  export let date = new Date()

  let internal

  const input = (x) => (internal = dayjs(x).format(format))
  const output = (x) => (date = dayjs(x, format).toDate())

  $: input(date)
  $: output(internal)
</script>

<input type="datetime-local" bind:value={internal} />