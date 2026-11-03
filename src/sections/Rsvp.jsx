import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { CalendarPlus, Check, LoaderCircle, MessageCircle, Minus, Pencil, Plus, Send } from 'lucide-react'
import { useId, useState } from 'react'
import { couple, events, wedding } from '../data/wedding'
import { downloadIcs } from '../lib/calendar'
import { load, save } from '../lib/storage'
import Button from '../components/ui/Button'
import RevealText from '../components/ui/RevealText'
import { Lotus, Sparkle } from '../components/ui/Ornaments'
import { useToast } from '../context'

const STORAGE_KEY = 'ishaani-kabir:rsvp'
const MEALS = ['Vegetarian', 'Jain', 'Non-vegetarian']
const EMPTY = {
  name: '',
  phone: '',
  attending: 'yes',
  guests: 2,
  events: events.map((e) => e.id),
  meal: 'Vegetarian',
  pickup: false,
  message: '',
}

// Returns an error message for each field that is not filled in correctly.
function validate(form) {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Please tell us your name'
  const digits = form.phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 13) errors.phone = 'A 10-digit mobile number, please'
  if (form.attending === 'yes' && form.events.length === 0) errors.events = 'Pick at least one celebration'
  return errors
}

// Ignores old or broken saved data so the form never crashes.
function loadSaved() {
  const saved = load(STORAGE_KEY, null)
  if (!saved || typeof saved !== 'object' || !Array.isArray(saved.events)) return null
  return { ...EMPTY, ...saved }
}

// Form field with a label on top and an error message below.
function Field({ label, error, children, htmlFor }) {
  const Label = htmlFor ? 'label' : 'p'
  return (
    <div>
      <Label htmlFor={htmlFor} className="eyebrow block text-ink/55">
        {label}
      </Label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-2 text-xs font-medium text-sindoor"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputClass =
  'mt-2 w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 font-display text-xl text-ink placeholder:text-ink/30 transition-colors focus:border-maroon focus:outline-none'

// Thank-you card shown after the RSVP is sent.
function Success({ data, onEdit }) {
  const yes = data.attending === 'yes'
  const chosen = events.filter((e) => data.events.includes(e.id))
  const summary = yes
    ? `Namaste! ${data.name} here — joyfully accepting the invitation to ${couple.bride.first} & ${couple.groom.first}'s wedding (${data.guests} guest${data.guests > 1 ? 's' : ''}) for ${chosen.map((e) => e.name).join(', ')}. ${couple.hashtag}`
    : `Namaste! ${data.name} here — with love and regret, I won't be able to attend ${couple.bride.first} & ${couple.groom.first}'s wedding. Sending all my blessings! ${couple.hashtag}`

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center py-6 text-center"
    >
      <motion.div
        initial={{ scale: 2.4, rotate: -30, opacity: 0 }}
        animate={{ scale: 1, rotate: -8, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
        className="grid size-28 place-items-center rounded-full border-2 border-dashed border-sindoor/70 text-sindoor"
      >
        <div className="text-center">
          <Check size={30} className="mx-auto" strokeWidth={2.2} />
          <span className="eyebrow mt-1 block text-[0.55rem]!">Received</span>
        </div>
      </motion.div>
      <h3 className="mt-8 font-display text-4xl text-ink">
        {yes ? 'We can’t wait to see you' : 'You’ll be missed'}, <span className="font-serif text-sindoor italic">{data.name.split(' ')[0]}</span>
      </h3>
      <p className="mt-4 max-w-sm text-ink/65">
        {yes
          ? `We’ve saved ${data.guests} seat${data.guests > 1 ? 's' : ''} for ${chosen.length === events.length ? 'every celebration' : chosen.map((e) => e.name).join(', ')}. A detailed itinerary will reach you on WhatsApp.`
          : 'Thank you for letting us know. Your blessings mean the world — leave one for us below.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href={`https://wa.me/?text=${encodeURIComponent(summary)}`} variant="ink" icon={MessageCircle}>
          Share on WhatsApp
        </Button>
        {yes && (
          <Button variant="ghost" icon={CalendarPlus} className="text-ink" onClick={() => downloadIcs(chosen)}>
            Save dates
          </Button>
        )}
      </div>
      <button type="button" onClick={onEdit} className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-ink/55 uppercase underline-offset-4 hover:text-ink hover:underline">
        <Pencil size={13} /> Edit my response
      </button>
    </motion.div>
  )
}

// RSVP form. Answers are saved in this browser (no server yet), so a guest sees their reply on return.
export default function Rsvp() {
  const [saved] = useState(loadSaved)
  const [form, setForm] = useState(saved ?? EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(saved ? 'done' : 'idle')
  const toast = useToast()
  const uid = useId()

  const update = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const toggleEvent = (id) =>
    update('events', form.events.includes(id) ? form.events.filter((e) => e !== id) : [...form.events, id])

  const submit = async (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) return
    setStatus('sending')
    // Short pause to feel like sending; swap this for a real API call later.
    await new Promise((r) => setTimeout(r, 1400))
    save(STORAGE_KEY, form)
    setStatus('done')
    toast(form.attending === 'yes' ? 'RSVP sent — see you in Udaipur!' : 'Thank you for letting us know')
  }

  const attending = form.attending === 'yes'

  return (
    <section id="rsvp" className="relative overflow-hidden bg-wine py-28 sm:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_15%_30%,rgba(200,56,43,0.25),transparent_70%),radial-gradient(50%_50%_at_90%_90%,rgba(239,160,47,0.12),transparent_70%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-3 text-gold">
            <span className="eyebrow">08</span>
            <span className="h-px w-10 bg-current opacity-50" />
            <span className="eyebrow">Kindly respond</span>
            <span className="font-deva text-sm opacity-80">· उत्तर</span>
          </p>
          <h2 className="mt-6 font-display text-[clamp(2.8rem,6.4vw,6rem)] leading-[0.95] tracking-[-0.02em] text-ivory">
            <RevealText text="Will you" />
            <br />
            <RevealText text="grace us?" delay={0.1} className="font-serif text-marigold italic" />
          </h2>
          <p className="mt-8 max-w-md leading-relaxed text-ivory/70">
            Your answer helps us plan everything from the boats to Jagmandir to the number of jalebis. Please respond by{' '}
            <span className="text-gold">{wedding.rsvpBy}</span>.
          </p>
          <div className="mt-10 flex items-center gap-5 text-gold/80">
            <Lotus size={52} />
            <p className="font-serif text-xl text-ivory/80 italic">“Atithi Devo Bhava” — the guest is god.</p>
          </div>
        </div>

        <motion.div
          data-theme="light"
          initial={{ opacity: 0, y: 50, rotate: 1.5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="paper relative rounded-sm p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] sm:p-12"
        >
          <div className="pointer-events-none absolute inset-3 rounded-xs border border-gold-deep/30" />
          <div className="pointer-events-none absolute inset-4 rounded-xs border border-gold-deep/15" />
          <Sparkle size={14} className="absolute top-6 left-1/2 -translate-x-1/2 text-gold-deep" />

          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <Success
                data={form}
                onEdit={() => {
                  setStatus('idle')
                }}
              />
            ) : (
              <motion.form key="form" noValidate onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="relative space-y-9 pt-6">
                <LayoutGroup id="attending">
                  <div role="group" aria-label="Will you attend?" className="grid grid-cols-2 gap-1 rounded-full border border-ink/15 p-1">
                    {[
                      ['yes', 'Joyfully accept'],
                      ['no', 'Regretfully decline'],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={form.attending === value}
                        onClick={() => update('attending', value)}
                        className={`relative rounded-full px-3 py-3.5 text-[0.7rem] font-bold tracking-[0.14em] uppercase transition-colors sm:text-xs ${form.attending === value ? 'text-ivory' : 'text-ink/60 hover:text-ink'}`}
                      >
                        {form.attending === value && (
                          <motion.span layoutId="attend-pill" className="absolute inset-0 rounded-full bg-maroon" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                        )}
                        <span className="relative">{label}</span>
                      </button>
                    ))}
                  </div>
                </LayoutGroup>

                <div className="grid gap-8 sm:grid-cols-2">
                  <Field label="Your name" error={errors.name} htmlFor={`${uid}-name`}>
                    <input
                      id={`${uid}-name`}
                      className={inputClass}
                      placeholder="Aditi Sharma"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                    />
                  </Field>
                  <Field label="WhatsApp number" error={errors.phone} htmlFor={`${uid}-phone`}>
                    <input
                      id={`${uid}-phone`}
                      className={inputClass}
                      placeholder="+91 98xxx xxxxx"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value.replace(/[^\d+\s-]/g, ''))}
                      aria-invalid={Boolean(errors.phone)}
                    />
                  </Field>
                </div>

                <AnimatePresence initial={false}>
                  {attending && (
                    <motion.div
                      key="attending-fields"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-9 overflow-hidden"
                    >
                      <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-end">
                        <div>
                          <span className="eyebrow block text-ink/55">Guests (incl. you)</span>
                          <div className="mt-3 flex items-center gap-5">
                            <button
                              type="button"
                              aria-label="Fewer guests"
                              disabled={form.guests <= 1}
                              onClick={() => update('guests', form.guests - 1)}
                              className="grid size-11 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-ivory disabled:opacity-30"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="relative h-10 w-8 overflow-hidden text-center font-display text-4xl leading-10 text-ink" aria-live="polite">
                              <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span key={form.guests} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -30, opacity: 0 }} className="absolute inset-0">
                                  {form.guests}
                                </motion.span>
                              </AnimatePresence>
                            </span>
                            <button
                              type="button"
                              aria-label="More guests"
                              disabled={form.guests >= 6}
                              onClick={() => update('guests', form.guests + 1)}
                              className="grid size-11 place-items-center rounded-full border border-ink/20 text-ink transition-colors hover:bg-ink hover:text-ivory disabled:opacity-30"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        <label className="flex items-center justify-between gap-4 rounded-full border border-ink/15 py-2.5 pr-2.5 pl-5 sm:ml-auto sm:w-fit">
                          <span className="text-sm font-medium text-ink/80">Airport pickup from UDR</span>
                          <input type="checkbox" className="peer sr-only" checked={form.pickup} onChange={(e) => update('pickup', e.target.checked)} />
                          <span className="relative h-7 w-12 rounded-full bg-ink/15 transition-colors peer-checked:bg-maroon peer-focus-visible:outline peer-focus-visible:outline-maroon after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-ivory after:shadow after:transition-transform peer-checked:after:translate-x-5" />
                        </label>
                      </div>

                      <Field label="Celebrations you’ll attend" error={errors.events}>
                        <div role="group" aria-label="Celebrations you will attend" className="mt-3 flex flex-wrap gap-2">
                          {events.map((ev) => {
                            const on = form.events.includes(ev.id)
                            return (
                              <button
                                key={ev.id}
                                type="button"
                                aria-pressed={on}
                                onClick={() => toggleEvent(ev.id)}
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${on ? 'border-maroon bg-maroon text-ivory' : 'border-ink/20 text-ink/70 hover:border-ink'}`}
                              >
                                <motion.span animate={{ width: on ? 14 : 0, opacity: on ? 1 : 0 }} className="inline-flex overflow-hidden">
                                  <Check size={14} />
                                </motion.span>
                                {ev.name}
                              </button>
                            )
                          })}
                        </div>
                      </Field>

                      <div>
                        <span className="eyebrow block text-ink/55">Meal preference</span>
                        <div role="group" aria-label="Meal preference" className="mt-3 flex flex-wrap gap-2">
                          {MEALS.map((meal) => (
                            <button
                              key={meal}
                              type="button"
                              aria-pressed={form.meal === meal}
                              onClick={() => update('meal', meal)}
                              className={`rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${form.meal === meal ? 'border-ink bg-ink text-ivory' : 'border-ink/20 text-ink/70 hover:border-ink'}`}
                            >
                              {meal}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Field label="A note for the couple (optional)" htmlFor={`${uid}-msg`}>
                  <textarea
                    id={`${uid}-msg`}
                    rows={2}
                    className={`${inputClass} resize-none text-lg!`}
                    placeholder="Can’t wait to dance at the sangeet!"
                    value={form.message}
                    maxLength={280}
                    onChange={(e) => update('message', e.target.value)}
                  />
                </Field>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-maroon py-5 text-xs font-bold tracking-[0.22em] text-ivory uppercase transition-transform active:scale-[0.98] disabled:opacity-80"
                >
                  <span className="absolute inset-0 translate-y-full bg-sindoor transition-transform duration-500 ease-luxe group-hover:translate-y-0" />
                  <span className="relative flex items-center gap-3">
                    {status === 'sending' ? (
                      <>
                        <LoaderCircle size={16} className="animate-spin" /> Sending with love…
                      </>
                    ) : (
                      <>
                        Send my RSVP <Send size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </span>
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
