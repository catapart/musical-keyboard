import { MagnitSynth } from 'magnit-synth';
import { default as style } from './musical-keyboard.component.css';
import { default as html } from './musical-keyboard.component.html';

const componentTemplate = `<style>${style}</style>${html}`;

export namespace MusicalKeyboard
{
    /**
     * The tag name for the component default: `musical-keyboard`
     */
    const COMPONENT_TAG_NAME = 'musical-keyboard';
    const KeybedRegisterKey = 'keybed';
    const PadsRegisterKey = 'pads';


    /**
     * Number of Pad inputs this controller has
     */
    const NumberOfPads = 10;
    /**
     * Register offset of the first pad
     */
    const Pad_StartOffset = 60;
    
    // export class KeyboardContext
    // {
    //     audioContext: AudioContext;
    //     defaultGainNode: GainNode;
    //     keybedRegisters: Map<number, Register>; // keybed is a dynamic index input; number of notes represented changes (88, 61, etc); 
    //     padsRegisters: Map<number, Register>; // pads input is a static index input; number of notes represented is always the same: 10; 
    //     activeNoteMap: Map<Instrument, Map<string,Map<Note, NoteProperties>>>;
    //     selectedInstrumentMode?: string;
    
    //     constructor()
    //     {
    //         this.audioContext = new AudioContext();
    //         this.defaultGainNode = this.audioContext.createGain();
    //         this.defaultGainNode.connect(this.audioContext.destination);
    //         this.keybedRegisters = new Map();
    //         this.padsRegisters = new Map();
    //         this.activeNoteMap = new Map();
    //     }

    //     findKeybedRegister(frequency: number)
    //     {
            
    //         const lowTolerance = frequency - FrequencyTolerance;
    //         const highTolerance = frequency + FrequencyTolerance;
    //         let value = frequency;
    //         for(const [currentFrequency, message] of this.keybedRegisters)
    //         {
    //             if(currentFrequency == frequency) { break; }
    //             if(currentFrequency > lowTolerance && currentFrequency < highTolerance)
    //             {
    //                 value = currentFrequency;
    //                 break;
    //             }
    //         }
    //         return this.keybedRegisters.get(value);
    //     }
    //     findPadRegister(frequency: number)
    //     {            
    //         const lowTolerance = frequency - FrequencyTolerance;
    //         const highTolerance = frequency + FrequencyTolerance;
    //         let value = frequency;
    //         for(const [currentFrequency, message] of this.padsRegisters)
    //         {
    //             if(currentFrequency == frequency) { break; }
    //             if(currentFrequency > lowTolerance && currentFrequency < highTolerance)
    //             {
    //                 value = currentFrequency;
    //                 break;
    //             }
    //         }
    //         return this.padsRegisters.get(value);
    //     }

    //     findActiveNoteProperties(instrument: Instrument, note: Note)
    //     {
    //         const instrumentEntry = this.activeNoteMap.get(instrument);
    //         if(instrumentEntry == null) { return null; }

    //         const noteMap = instrumentEntry.get(note.mappingName);
    //         if(noteMap == null) { return null; }
    
    //         return noteMap.get(note);
    //     }
    // }

    const IndexClass = new Map<number, string>([
        [1, "one"],
        [2, "two"],
        [3, "three"],
        [4, "four"],
        [5, "five"],
        [6, "six"],
        [7, "seven"],
        [8, "eight"],
        [9, "nine"],
        [10, "ten"]
    ]);

    const GlyphEntryKeyboardCodeMap = new Map([
        ["KeyA", new MagnitSynth.Register("C", 261.6255653005986, 4)],
        ["KeyW", new MagnitSynth.Register("C#", 277.1826309768721, 4)],
        ["KeyS", new MagnitSynth.Register("D", 293.6647679174076, 4)],
        ["KeyE", new MagnitSynth.Register("D#", 311.12698372208087, 4)],
        ["KeyD", new MagnitSynth.Register("E", 329.6275569128699, 4)],
        ["KeyF", new MagnitSynth.Register("F", 349.2282314330039, 4)],
        ["KeyT", new MagnitSynth.Register("F#", 369.99442271163446, 4)],
        ["KeyG", new MagnitSynth.Register("G", 391.99543598174927, 4)],
        ["KeyY", new MagnitSynth.Register("G#", 415.3046975799451, 4)],
        ["KeyH", new MagnitSynth.Register("A", 440, 4)],
        ["KeyU", new MagnitSynth.Register("A#", 466.1637615180899, 4)],
        ["KeyJ", new MagnitSynth.Register("B", 493.8833012561241, 4)],
    ]);

    /**
     * `select`: Begin loading all audio samples when the instrument is selected.  
     * `preload`: Loop through every instrument and begin loading all audio samples.  
     * `none`: Do not load any samples; All loading will be handled by the implementer.  
     */
    export type LoadMethod = 'select'|'preload'|'none';

    

    export class GrandPiano extends MagnitSynth.InterpolatedSampleInstrument implements MagnitSynth.Instrument
    {
        name: string = "Grand Piano";

        async load(context: MagnitSynth.ControllerContext, onProgressEvent?: (event: { instrument: MagnitSynth.Instrument, progress: number }) => void): Promise<void> 
        {
            if(this.isLoaded == true)
            { 
                if(onProgressEvent != null)
                {
                    onProgressEvent({instrument: this, progress: 100});
                }
                return;
            }

            const sampleNotes = 
            [
                "A0",
                "C1",
                "D#1",
                "F#1",
                "A1",
                "C2",
                "D#2",
                "F#2",
                "A2",
                "C3",
                "D#3",
                "F#3",
                "A3",
                "C4",
                "D#4",
                "F#4",
                "A4",
                "C5",
                "D#5",
                "F#5",
                "A5",
                "C6",
                "D#6",
                "F#6",
                "A6",
                "C7",
                "D#7",
                "F#7",
                "A7",
                "C8",
            ];
            
            const registers = MagnitSynth.getKeybedRegisters();

            const sampleData_16velocity = new Map<number, string[]>();
            const sampleData_4velocity = new Map<number, string[]>(); // debug
            const sampleData_1velocity = new Map<number, string[]>(); // debug
            for(let i = 0; i < sampleNotes.length; i++)
            {
                const register = registers.find((item: MagnitSynth.Register) => item.defaultLabel + item.octave.toString() == sampleNotes[i]);
                if(register == null) { throw new Error(`Unknown register assignment: ${sampleNotes[i]}`); }
                const fileName = sampleNotes[i].replace('#', 's');
                sampleData_16velocity.set(register.frequency, 
                [
                    `./samples/grand-piano/${fileName}v1.opus`,
                    `./samples/grand-piano/${fileName}v2.opus`,
                    `./samples/grand-piano/${fileName}v3.opus`,
                    `./samples/grand-piano/${fileName}v4.opus`,
                    `./samples/grand-piano/${fileName}v5.opus`,
                    `./samples/grand-piano/${fileName}v6.opus`,
                    `./samples/grand-piano/${fileName}v7.opus`,
                    `./samples/grand-piano/${fileName}v8.opus`,
                    `./samples/grand-piano/${fileName}v9.opus`,
                    `./samples/grand-piano/${fileName}v10.opus`,
                    `./samples/grand-piano/${fileName}v11.opus`,
                    `./samples/grand-piano/${fileName}v12.opus`,
                    `./samples/grand-piano/${fileName}v13.opus`,
                    `./samples/grand-piano/${fileName}v14.opus`,
                    `./samples/grand-piano/${fileName}v15.opus`,
                    `./samples/grand-piano/${fileName}v16.opus`,
                ]);


                // debugging
                sampleData_4velocity.set(register.frequency, 
                [
                    `./samples/grand-piano/${fileName}v2.opus`,
                    `./samples/grand-piano/${fileName}v6.opus`,
                    `./samples/grand-piano/${fileName}v10.opus`,
                    `./samples/grand-piano/${fileName}v14.opus`
                ]);
                sampleData_1velocity.set(register.frequency, 
                [
                    `./samples/grand-piano/${fileName}v8.opus`
                ]);
            }
            // const sampleData_4velocity = new Map<number, string[]>();
            // for(let i = 0; i < sampleNotes.length; i++)
            // {
            //     const register = registers.find(item => item.defaultLabel == sampleNotes[i]);
            //     if(register == null) { throw new Error(`Unknown register assignement: ${sampleNotes[i]}`); }
            //     const fileName = register.defaultLabel.replace('#', 's');
            //     sampleData_4velocity.set(register.frequency, 
            //     [
            //         `./samples/grand-piano/${fileName}v2.opus`,
            //         `./samples/grand-piano/${fileName}v6.opus`,
            //         `./samples/grand-piano/${fileName}v10.opus`,
            //         `./samples/grand-piano/${fileName}v14.opus`
            //     ]);
            // }

            // const sampleData_1velocity = new Map<number, string[]>();
            // for(let i = 0; i < sampleNotes.length; i++)
            // {
            //     const register = registers.find(item => item.defaultLabel == sampleNotes[i]);
            //     if(register == null) { throw new Error(`Unknown register assignement: ${sampleNotes[i]}`); }
            //     const fileName = register.defaultLabel.replace('#', 's');
            //     sampleData_1velocity.set(register.frequency, 
            //     [
            //         `./samples/grand-piano/${fileName}v8.opus`
            //     ]);
            // }

            this.samples = MagnitSynth.InterpolatedSampleInstrument.intoSamples_Frequency(context, sampleData_4velocity, KeybedRegisterKey);
            await super.load(context, onProgressEvent);
            this.isLoaded = true;
        }
    }
    export class RockDrumKit extends MagnitSynth.SimpleSampleInstrument implements MagnitSynth.Instrument
    {
        name: string = "Rock Drum Kit";
        modes = [
            // strikes
            "Cowbell",
            "Snare Rim",
            "Drumstick Clack",
            "Pipe",
            "Tube",
            // body
            "Clap",
            "Stomp",
            "Smack",
            "Snap",
            // vocal
            "Oooh",
            "Oof",
            "Aaah",
            "Ahhh!",
            "Ay!",
            "Ayyyy!",
            // synthetic
            "Metronome Click",
            "Record Scratch",
            "Blade Shing",
            // digital
            "Pew",
        ];

        async load(context: MagnitSynth.ControllerContext, onProgressEvent?: (event: { instrument: MagnitSynth.Instrument, progress: number }) => void)
        {
            if(this.isLoaded == true)
            { 
                if(onProgressEvent != null)
                {
                    onProgressEvent({instrument: this, progress: 100});
                }
                return;
            }

            
            // rock kit nomenclature
            /**
             * Strong Crash Cymbal | Passing Rack Tom | Sustain Rack Tom | Sustain Crash Cymbal  | Ride Cymbal
             * Hi-Hat              | Snare            | Kick             | Passing Floor Tom     | Sustain Floor Tom
             */

            // ideal kit (not actually sampled; just used as a baseline to mimic these components with available samples)
            /**
             * 16" Crash Cymbal | 10" Rack Tom | 12" Rack Tom     | 18" Crash Cymbal  | 20" Ride Cymbal
             * Hi-Hats          | Snare        | Kick             | 14" Floor Tom     | 16" Floor Tom
             */
            // const registers = getIndexedRegisters();

            const samplePaths = [
                [
                    `./samples/rock-drum/Bassv5.opus`,
                    `./samples/rock-drum/Bassv7.opus`,
                    `./samples/rock-drum/Bassv9.opus`,
                ],
                [
                    `./samples/rock-drum/CrashStrongv5.opus`,
                    `./samples/rock-drum/CrashStrongv7.opus`,
                    `./samples/rock-drum/CrashStrongv9.opus`,
                ],
                `./samples/rock-drum/CrashSustainv7.opus`,
                [
                    `./samples/rock-drum/HiHatv5.opus`,
                    `./samples/rock-drum/HiHatv7.opus`,
                    `./samples/rock-drum/HiHatv9.opus`,
                ],
                [
                    `./samples/rock-drum/Ridev5.opus`,
                    `./samples/rock-drum/Ridev7.opus`,
                ],
                [
                    `./samples/rock-drum/Snarev5.opus`,
                    `./samples/rock-drum/Snarev7.opus`,
                    `./samples/rock-drum/Snarev9.opus`,
                ],
                `./samples/rock-drum/TomFloorPassingv7.opus`,
                `./samples/rock-drum/TomFloorSustainv7.opus`,
                [
                    `./samples/rock-drum/TomRackPassingv7.opus`,
                    `./samples/rock-drum/TomRackPassingv9.opus`,
                ],
                [
                    `./samples/rock-drum/TomRackSustainv7.opus`,
                    `./samples/rock-drum/TomRackSustainv9.opus`,
                ],
            ]

            this.samples = MagnitSynth.SimpleSampleInstrument.intoSamples(context, samplePaths, 60, PadsRegisterKey);
            await super.load(context, onProgressEvent);
            // console.log(this.samples);
            this.isLoaded = true;
        }
    }
    
    export class OscillatorOrgan implements MagnitSynth.Instrument, MagnitSynth.Oscillator
    {
        // playbackMethod: PlaybackMethod = 'oscillator';
        modes: OscillatorType[] = ['sine', 'square', 'triangle', 'sawtooth'];
        selectedMode: OscillatorType;

        constructor(public name: string, public mode?: OscillatorType)
        {
            this.selectedMode = mode ?? this.modes[0];
        }
        async playNote(context: MagnitSynth.ControllerContext, note: MagnitSynth.Note)
        {
            const oscillatorNode = context.audioContext.createOscillator();
            oscillatorNode.type = this.selectedMode;
            oscillatorNode.frequency.value = note.frequency;
            const gainNode = context.audioContext.createGain();
            oscillatorNode.connect(gainNode);
            gainNode.connect(context.mainVolumeGainNode);

            const properties = 
            {
                gainNode, 
                volume: .5, 
                oscillatorNode 
            };

            // volume (gain) ramping prevents 'pop' sounds;
            gainNode.gain.setValueAtTime(0, context.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(properties.volume, context.audioContext.currentTime + .02);
            oscillatorNode.start();
            return properties;
        }
        async endNote(context: MagnitSynth.ControllerContext, note: MagnitSynth.Note): Promise<void>
        {
            return new Promise<void>((resolve) => 
            {
                const noteProperties = context.findActiveNoteProperties(this, note);
                if(noteProperties == null) { throw new Error("Could not find note"); }

                // volume (gain) ramping prevents 'pop' sounds;
                noteProperties.gainNode.gain.cancelScheduledValues(context.audioContext.currentTime);
                noteProperties.gainNode.gain.setValueAtTime(noteProperties.gainNode.gain.value, context.audioContext.currentTime);
                noteProperties.gainNode.gain.linearRampToValueAtTime(0, context.audioContext.currentTime + .2);

                if(note.playbackTimeout != null)
                {
                    clearTimeout(note.playbackTimeout);
                }

                note.playbackTimeout = setTimeout(() =>
                {
                    resolve();
                }, 202);
            });
        }
        disconnectNote(context: MagnitSynth.ControllerContext, note: MagnitSynth.Note)
        {
            const noteProperties = context.findActiveNoteProperties(this, note);
            if(noteProperties == null) { throw new Error("Could not find note"); }

            noteProperties.oscillatorNode.disconnect();
        }
    }
    // export class WaveTablePiano extends WaveTablePlayer
    // {
    //     constructor(waveTableData: WaveTableData)
    //     {
    //         super("Wave Table Piano", waveTableData);
    //     }
    // }

    export const ComponentEvent =
    {
        connect: "connect",
        disconnect: "disconnect",
        adopted: "adopted",
        attributechanged: "attributechanged",
        context: "context",
        state: "state"
    } as const;
    export function registerComponent() 
    {
        if(customElements.get(COMPONENT_TAG_NAME) != null)
        {
            return;
        }
        customElements.define(COMPONENT_TAG_NAME, KeyboardController);
    }
    export class KeyboardController extends HTMLElement implements MagnitSynth.DigitalController
    {
        static get observedAttributes() { return ['preset-size']; }

        
        #keyCount: number = 88;
        #useCustomContext: boolean = false;
        #instruments: MagnitSynth.Instrument[] = [];
        #loadMethod: LoadMethod = 'select';
        #useDefaultInstruments: boolean = true;
        #midiAccess: MIDIAccess|null = null;
        #editingPadIndex: number = -1;

        #selectedKeybedInstrument: MagnitSynth.Instrument|null = null;
        #selectedPadsInstrument: MagnitSynth.Instrument|null = null;

        keyboardContext: MagnitSynth.ControllerContext|undefined;
        pointerIsDown: boolean = false;

        $keysInstruments!: HTMLSelectElement;
        $keyCountSelect!: HTMLSelectElement;
        $keysInstrumentProgress!: HTMLProgressElement;
        $settingsButton!: HTMLButtonElement;

        $padsBed!: HTMLSelectElement;
        $padsInstruments!: HTMLSelectElement;
        $padsInstrumentProgress!: HTMLProgressElement;

        $lastUsedSelect: HTMLSelectElement|undefined;

        $midiSwitch!: HTMLElement;
        $activateMIDIButton!: HTMLButtonElement;

        $keybed!: HTMLElement;

        $settingsDialog!: HTMLDialogElement;
        $padPropertiesForm!: HTMLFormElement;
        $padProperties_noteSelect!: HTMLSelectElement;
        $settingsCloseButton!: HTMLButtonElement;
        $settingsOkButton!: HTMLButtonElement;

        boundHandlers: any;

        #pointerKey?: HTMLElement;
        #pointerKeyNote?: MagnitSynth.Note;
        #pointerPad?: HTMLElement;
        #pointerPadNote?: MagnitSynth.Note;
        #glyphEntryNotes: Map<string, MagnitSynth.Note|null> = new Map([
            ["KeyA", null],
            ["KeyW", null],
            ["KeyS", null],
            ["KeyE", null],
            ["KeyD", null],
            ["KeyF", null],
            ["KeyT", null],
            ["KeyG", null],
            ["KeyY", null],
            ["KeyH", null],
            ["KeyU", null],
            ["KeyJ", null],
        ]);
        #midiEntryNotes: Map<number, MagnitSynth.Note|null> = new Map();

        #isActiveMidiController: boolean = false;
        get isActiveMidiController()
        {
            return this.#isActiveMidiController;
        }
        set isActiveMidiController(value: boolean)
        {
            this.#isActiveMidiController = value;
            
            if(this.#isActiveMidiController == true)
            {
                this.$activateMIDIButton.classList.add('on');
                const midiKeyboards = (this.getRootNode() as any).querySelectorAll('midi-keyboard');
                for(let i = 0; i < midiKeyboards.length; i++)
                {
                    if(midiKeyboards[i] == this) { continue; }
                    midiKeyboards[i].isActiveMidiController = false;
                }
            }
            else
            {
                this.$activateMIDIButton.classList.remove('on');
            }
        }

        async connectedCallback()
        { 
            this.dispatchEvent(new Event(ComponentEvent.connect));
            
            this.$keybed = this.shadowRoot!.querySelector('.keybed')!;
            this.$keyCountSelect = this.shadowRoot!.querySelector('select.key-count')!;
            this.$keysInstruments = this.shadowRoot!.querySelector('.controls select.instruments')!;
            this.$keysInstrumentProgress = this.shadowRoot!.querySelector('.main progress')!;
            this.$settingsButton = this.shadowRoot!.querySelector('.main button')!;
            this.$padsBed = this.shadowRoot!.querySelector('.pads')!;
            this.$padsInstruments = this.shadowRoot!.querySelector('.pads select.instruments')!;
            this.$padsInstrumentProgress = this.shadowRoot!.querySelector('.pads progress')!;
            this.$midiSwitch = this.shadowRoot!.querySelector('.midi-state .switch')!;
            this.$activateMIDIButton = this.shadowRoot!.querySelector('.midi-state button')!;
            this.$settingsDialog = this.shadowRoot!.querySelector('dialog')!;
            this.$padPropertiesForm = this.$settingsDialog.querySelector('.pad-mapping .properties form')!;
            this.$padProperties_noteSelect = this.$padPropertiesForm.querySelector('select[name="note"]')!;
            this.$settingsCloseButton = this.shadowRoot!.querySelector('dialog button.close')!;
            this.$settingsOkButton = this.shadowRoot!.querySelector('dialog button.ok')!;
            
            this.updateKeybed();
            this.updatePads();
            this.updateNoteSelection();

            this.$keyCountSelect.value = this.#keyCount.toString();
            this.$keyCountSelect.addEventListener('change', (event) =>
            {
                this.setAttribute('preset-size', this.$keyCountSelect.value);
            });

            this.$keysInstruments.addEventListener('change', (event: Event) =>
            {
                this.setSelectedKeybedInstrumentByIndex(this.$keysInstruments.selectedIndex);
            });

            this.$settingsButton.addEventListener('click', (event) =>
            {
                this.$settingsDialog.open = true;
            });
            this.$settingsCloseButton.addEventListener('click', (event) =>
            {
                this.$settingsDialog.open = false;
            });
            this.$settingsOkButton.addEventListener('click', (event) =>
            {
                this.$settingsDialog.open = false;
            });

            this.$padsInstruments.addEventListener('change', (event: Event) =>
            {
                this.setSelectedPadsInstrumentByIndex(this.$padsInstruments.selectedIndex);
            });

            this.$keysInstruments.addEventListener('pointerdown', () =>
            {
                this.$lastUsedSelect = this.$keysInstruments;
            });
            this.$padsInstruments.addEventListener('pointerdown', () =>
            {
                this.$lastUsedSelect = this.$padsInstruments;
            });

            this.$activateMIDIButton.addEventListener('click', async () =>
            {
                this.isActiveMidiController = !this.isActiveMidiController;

                if(this.#midiAccess != null || navigator.requestMIDIAccess == undefined) { return; }

                this.#midiAccess = await navigator.requestMIDIAccess();
                console.log(this.#midiAccess);

                this.#midiAccess.inputs.forEach((input: MIDIInput) =>
                {
                    input.onmidimessage = this.midi_OnMessage.bind(this);
                });

            });
            
            const padSelections = Array.from(this.$settingsDialog.querySelectorAll('.pad-mapping .pad-selection .pad')) as HTMLButtonElement[];
            for(let i = 0; i < padSelections.length; i++)
            {
                padSelections[i].addEventListener('click', () =>
                {
                    this.setEditingPad(padSelections[i]);
                });
            }

            this.$padPropertiesForm.addEventListener('submit', (event: SubmitEvent) =>
            {
                event.stopPropagation();
                event.preventDefault();

                const formData = new FormData(this.$padPropertiesForm);
                console.log(formData.forEach(item => item));

                return false;
            });

            // if we're using default instruments...
            if(this.#useDefaultInstruments == true)
            {
                // create them...
                // const oscillatorOrgan = new MusicalKeyboard.Instruments.OscillatorOrgan('Oscillator Organ', 'sine');
                const sineOrgan = new OscillatorOrgan('Sine Organ', 'sine');
                const squareOrgan = new OscillatorOrgan('Square Organ', 'square');
                const triangleOrgan = new OscillatorOrgan('Triangle Organ', 'triangle');
                const sawtoothOrgan = new OscillatorOrgan('Saw Organ', 'sawtooth');
                const grandPiano = new GrandPiano();
                const rockDrumKit = new RockDrumKit();
                // const waveTablePiano = new MusicalKeyboard.Instruments.WaveTablePiano(PianoWaveTable);

                this.#instruments.push(grandPiano);
                this.#instruments.push(rockDrumKit);
                this.#instruments.push(sineOrgan);
                this.#instruments.push(squareOrgan);
                this.#instruments.push(triangleOrgan);
                this.#instruments.push(sawtoothOrgan);
                // this.#instruments.push(waveTablePiano);

                this.setSelectedKeybedInstrumentByIndex(0);
                this.setSelectedPadsInstrumentByIndex(1);

                // and load their audio data
                this.loadInstruments();
            }
            // otherwise, the implementer will call loadInstruments(), when they've added all of their custom instruments;

        }
        async disconnectedCallback() { this.dispatchEvent(new Event(ComponentEvent.disconnect)); }
        adoptedCallback() { this.dispatchEvent(new Event(ComponentEvent.adopted)); }
        attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) 
        {  
            this.dispatchEvent(new CustomEvent(ComponentEvent.attributechanged, { detail: { attributeName, oldValue, newValue } })); 

            // const value = (event as CustomEvent).detail.newValue;
            if(attributeName == 'preset-size')
            {
                const keyCount = parseInt(newValue);
                this.#keyCount = keyCount;

                this.updateKeybed();
                this.updatePads();

                if(this.$keyCountSelect != null)
                {
                    this.$keyCountSelect.value = this.#keyCount.toString();
                }
            }
            else if(attributeName == 'load')
            {
                if(newValue == 'select' || newValue == 'preload' || newValue == 'none')
                {
                    this.#loadMethod = newValue;
                }
            }
        }
        
        constructor()
        {
            super();

            this.attachShadow({ mode: "open" });
            this.render();

            // intervals: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
            // natural key: longer, white key; Natural notes: C, D, E, F, G, A, B
            // modifier key: shorter, black key; Sharp or Flat notes: C#/D♭, D#/E♭, F#/G♭, G#/A♭, A#/B♭ 
            // ^^^^^^^^ (these are actually called "accidental" notes, but that's way too meaningful in a generic sense to use it here without it being confusing)


            this.boundHandlers = 
            {
                key_pointerEnter: this.key_onPointerEnter.bind(this),
                key_pointerLeave: this.key_onPointerLeave.bind(this),
                instrument_onLoadProgress: this.instrument_onLoadProgress.bind(this),
            };

            if(this.getAttribute('preset-size') == null)
            {
                this.#keyCount = 88;
            }

            const loadMethod = this.getAttribute('load');
            if(loadMethod != null)
            {
                if(loadMethod == 'select' || loadMethod == 'preload' || loadMethod == 'none')
                {
                    this.#loadMethod = loadMethod;
                }
            }
            const usingCustomInstruments = this.getAttribute('custom-instruments');
            if(usingCustomInstruments == "true") { this.#useDefaultInstruments = false; }
            
            document.addEventListener('pointerup', this.document_onPointerUp.bind(this));
            document.addEventListener('keydown', this.document_onKeyDown.bind(this));
            document.addEventListener('keyup', this.document_onKeyUp.bind(this));

            this.addEventListener('pointerdown', () =>
            {
                if(this.keyboardContext != null) { return; }
                
                this.openContext();
                this.loadInstruments();
                this.setAttribute('active', '');
            }, { once: true });

        }
        render()
        {
            this.shadowRoot!.innerHTML = componentTemplate;
        }

        

        async test()
        {
            // const schema = {
            //     "appSettings": "key",
            //     "boards": "id, order",
            //     "lanes": "id, boardId, order",
            //     "sections": "id, laneId, order",
            //     "tasks": "id, boardId, sectionId, order",
            //     "contacts": "id",
            //     "attachments": "id",
            //     "customImages": "id",
            //     "tags": "id, key",
            //     "taskAssignments": "id, parentTaskId",
            //     "contactAssignments": "id, taskId, order",
            //     "attachmentAssignments": "id, taskId, order",
            //     "tagAssignments": "id, [parentId+parentCategory], order",
            //     "tests": "id",
            // };
            // const storage = new IDBStorage();
            // await storage.open({name: "MusicalKeyboard", version: 1, schema });
            
            // const stores = 
            // {
            //     'test': new TestStore(storage, TestRecord, TestModel, ['tests']),
            // };
            // storage.addStores(stores);
            // await storage.save('test', new TestModel({id: "1", value: 1, name: "Two", isTesting: false } as TestRecord));
            // const model = await storage.find('test', {id: "1"});
            // const modelTicket = await storage.getTickets('test', ['id'], "1");
            // console.log(model, modelTicket);
            // // const record = {id: '1', name: "Test Object", value: 21, isTrue: false };
            // // await storage.save(record);
            // console.log('opened');
        }

        openContext()
        {
            this.keyboardContext = new MagnitSynth.ControllerContext();
            this.classList.remove('no-context');
            
            for(let i = 0; i < this.#instruments.length; i++)
            {
                this.keyboardContext!.activeNoteMap.set(this.#instruments[i], new Map<string, any>());
            }
                
            const keys = MagnitSynth.getKeybedRegisters(this.#keyCount);
            const keybedInputRegisters = new Map(keys.map((data: MagnitSynth.Register) =>
            {
                return [data.frequency, data];
            }));
            this.keyboardContext.controllerInputRegistersMap.set(KeybedRegisterKey, keybedInputRegisters);
            const pads = MagnitSynth.getIndexedRegisters();
            const padsInputRegisters = new Map(pads.map((data: MagnitSynth.Register) =>
            {
                return [data.frequency, data];
            }));
            this.keyboardContext.controllerInputRegistersMap.set(PadsRegisterKey, padsInputRegisters);
        }


        updateKeybed()
        {
            if(this.$keybed == null) { return; }
            const registers = MagnitSynth.getKeybedRegisters(this.#keyCount);
            const $keys: HTMLElement[] = [];
            // const noteCounts = new Map<string, number>();
            for(let i = 0; i < registers.length; i++)
            {            
                const register = registers[i];
                const $key = document.createElement('button');
                $key.classList.add('key');
                $key.style.setProperty('--grid-column-start', register.offset.toString());
                $key.setAttribute('aria-label', register.defaultLabel);
                $key.dataset.note = register.defaultLabel;
                $key.dataset.frequency = register.frequency.toString();
                $key.innerHTML = `<span class="label"><span class="note">${register.defaultLabel}</span><sup class="octave">${register.octave}</sup></span>`;
                
                $key.dataset.octave = register.octave.toString();
                $key.addEventListener('pointerdown', this.key_onPointerDown.bind(this));

                if(register.frequency == MagnitSynth.A4Frequency)
                {
                    $key.classList.add('a4-key');
                }
                else if(register.defaultLabel == 'C' && register.frequency > MagnitSynth.MiddleC_LowTolerance && register.frequency < MagnitSynth.MiddleC_HighTolerance)
                {
                    $key.classList.add('middle-c');
                }
                // else if(register.defaultLabel == 'C' && register.octave == 1)
                // {
                //     $key.classList.add('pointer');
                // }
                // else if(register.defaultLabel == 'C' && register.octave == 2)
                // {
                //     $key.classList.add('glyph-entry');
                // }
                // else if(register.defaultLabel == 'C' && register.octave == 3)
                // {
                //     $key.classList.add('midi');
                // }
                // else if(register.defaultLabel == 'C' && register.octave == 5)
                // {
                //     $key.classList.add('guide');
                // }
                $keys.push($key);
            }
            this.$keybed.innerHTML = "";
            this.$keybed.append(...$keys);

            if(this.keyboardContext != null)
            {
                const keybedInputRegisters = new Map(registers.map((data: MagnitSynth.Register) =>
                {
                    return [data.frequency, data];
                }));
                this.keyboardContext.controllerInputRegistersMap.set(KeybedRegisterKey, keybedInputRegisters);
            }
        }
        updatePads()
        {
            if(this.$padsBed == null) { return; }
            const registers = MagnitSynth.getIndexedRegisters();
            const $pads: HTMLElement[] = [];
            // const noteCounts = new Map<string, number>();
            for(let i = Pad_StartOffset; i < 70; i++)
            {
                const register = registers[i];
                const $pad = document.createElement('button');
                $pad.classList.add('pad', IndexClass.get((i-Pad_StartOffset) + 1)!.toString());
                $pad.setAttribute('aria-label', register.defaultLabel);
                $pad.setAttribute('title', `${register.defaultLabel}${register.octave}`);
                $pad.dataset.note = register.defaultLabel;
                $pad.dataset.frequency = register.frequency.toString();
                $pad.innerHTML = `<span class="target"></span>`;
                
                $pad.dataset.octave = register.octave.toString();
                $pad.addEventListener('pointerdown', this.pad_onPointerDown.bind(this));
                $pads.push($pad);
            }
            this.$padsBed.append(...$pads);

            if(this.keyboardContext != null)
            {
                const padsInputRegisters = new Map(registers.map((data: MagnitSynth.Register) =>
                {
                    return [data.frequency, data];
                }));
                this.keyboardContext.controllerInputRegistersMap.set(PadsRegisterKey, padsInputRegisters);
            }
        }
        updateNoteSelection()
        {
            let optionsHtml = "";
            const registers = MagnitSynth.getKeybedRegisters();
            for(let i = 0; i < registers.length; i++)
            {
                const register = registers[i];
                optionsHtml += `<option value="${register.frequency}">${register.defaultLabel}${register.octave}</option>`;
            }
            this.$padProperties_noteSelect.innerHTML = optionsHtml;
        }

        async loadInstruments()
        {
            this.updateInstrumentOptions();

            // const pianoWave = await (await fetch('./src/controls/midi-keyboard/piano.json')).json();
            // console.log(pianoWave);

            if(this.#loadMethod == 'preload')
            {
                const promises = [];
                for(let i = 0; i < this.#instruments.length; i++)
                {
                    if(this.#instruments[i] != this.#selectedKeybedInstrument && this.#instruments[i] != this.#selectedPadsInstrument)
                    {
                        promises.push(this.loadInstrument(this.#instruments[i]));
                    }
                }
                await Promise.all(promises);
            }
        }
        async loadInstrument(instrument: MagnitSynth.Instrument|null, $select?: HTMLSelectElement)
        {
            if(instrument == null || instrument.load == null || this.keyboardContext == null)
            {
                return;
            }
            
            
            if(this.$lastUsedSelect != null)
            {
                if(this.$lastUsedSelect == this.$keysInstruments)
                {
                    this.$keysInstruments.parentElement?.classList.add('loading');
                    this.$keybed.setAttribute('disabled', 'disabled');
                }
                else if(this.$lastUsedSelect == this.$padsInstruments)
                {
                    this.$padsInstruments.parentElement?.classList.add('loading');
                    this.$padsBed.setAttribute('disabled', 'disabled');
                }
            }
            else
            {
                if(instrument == this.#selectedKeybedInstrument)
                {
                    this.$keysInstruments.parentElement?.classList.add('loading');
                    this.$keybed.setAttribute('disabled', 'disabled');
                }
                else if(instrument == this.#selectedPadsInstrument)
                {
                    this.$padsInstruments.parentElement?.classList.add('loading');
                    this.$padsBed.setAttribute('disabled', 'disabled');
                }
            }

            await instrument.load(this.keyboardContext, this.instrument_onLoadProgress.bind(this));
        }
        instrument_onLoadProgress(event: { instrument: MagnitSynth.Instrument, progress: number })
        {
            const loadingElements = Array.from(this.shadowRoot!.querySelectorAll('.loading')) as HTMLElement[];
            if(loadingElements.length == 1)
            {
                const loadingSelect = loadingElements[0].querySelector('select');
                if(loadingSelect == this.$keysInstruments)
                {
                    this.$keysInstrumentProgress.value = event.progress;
                }
                else if (loadingSelect == this.$padsInstruments)
                {
                    this.$padsInstrumentProgress.value = event.progress;
                }
                
        
                if(event.progress == 100)
                {
                    if(loadingSelect == this.$keysInstruments)
                    {
                        this.$keysInstruments.parentElement?.classList.remove('loading');
                        this.$keybed.removeAttribute('disabled');
                    }
                    else if(loadingSelect == this.$padsInstruments)
                    {
                        this.$padsInstruments.parentElement?.classList.remove('loading');
                        this.$padsBed.removeAttribute('disabled');
                    }
                }
            }
            else
            {
                if(event.instrument == this.#selectedKeybedInstrument)
                {
                    this.$keysInstrumentProgress.value = event.progress;
                }
                else if (event.instrument == this.#selectedPadsInstrument)
                {
                    this.$padsInstrumentProgress.value = event.progress;
                }
        
                if(event.progress == 100)
                {
                    if(event.instrument == this.#selectedKeybedInstrument)
                    {
                        this.$keysInstruments.parentElement?.classList.remove('loading');
                        this.$keybed.removeAttribute('disabled');
                    }
                    else if(event.instrument == this.#selectedPadsInstrument)
                    {
                        this.$padsInstruments.parentElement?.classList.remove('loading');
                        this.$padsBed.removeAttribute('disabled');
                    }
                }
            }
        }

        updateInstrumentOptions()
        {
            // const selectedIndex_keys = this.$keysInstruments.selectedIndex;
            // // const selectedIndex_keysInstrumentMode = this.$keysInstrumentModes.selectedIndex;
            // const selectedIndex_pads = this.$padsInstruments.selectedIndex;
            // // const selectedIndex_padsInstrumentMode = this.$padsInstrumentModes.selectedIndex;
            
            this.$keysInstruments.innerHTML = "";
            this.$padsInstruments.innerHTML = "";

            let keysInstrumentsOptionsHtml = '';
            let padsInstrumentsOptionsHtml = '';
            for(let i = 0; i < this.#instruments.length; i++)
            {
                const instrument = this.#instruments[i];
                keysInstrumentsOptionsHtml += `<option value="${i}"><span class="label">${instrument.name}</span></option>`
                if(instrument instanceof OscillatorOrgan)
                {
                    continue;
                }
                padsInstrumentsOptionsHtml += `<option value="${i}"><span class="label">${instrument.name}</span></option>`;
            }
            this.$keysInstruments.innerHTML = keysInstrumentsOptionsHtml;
            this.$padsInstruments.innerHTML = padsInstrumentsOptionsHtml;


            if(this.#selectedKeybedInstrument != null)
            {
                let index = this.#instruments.indexOf(this.#selectedKeybedInstrument);
                if(index == -1)
                {
                    console.warn(`Selected instrument not found.`);
                    this.#selectedKeybedInstrument = this.#instruments[0];
                    index = 0;
                }
                this.setSelectedKeybedInstrumentByIndex(index);
            }

            if(this.#selectedPadsInstrument != null)
            {
                let index = this.#instruments.indexOf(this.#selectedPadsInstrument);
                if(index == -1)
                {
                    console.warn(`Selected instrument not found.`);
                    this.#selectedPadsInstrument = this.#instruments[0];
                    index = 0;
                }
                this.setSelectedPadsInstrumentByIndex(index);
            }
        }

        setSelectedKeybedInstrument(instrument: MagnitSynth.Instrument)
        {
            const index = this.#instruments.indexOf(instrument);
            if(index == -1)
            {
                throw new Error(`Cannot select instrument: Instrument has not been added to keyboard. Use the \`addInstrument\` method to include instruments.`);
            }
            this.setSelectedKeybedInstrumentByIndex(index);
        }
        setSelectedKeybedInstrumentByIndex(index: number)
        {
            const instrument = this.#instruments[index];
            if(instrument == null)
            {
                throw new Error(`Cannot select instrument with index ${index}: Value is null.`);
            }
            this.#selectedKeybedInstrument = instrument;

            this.$keysInstruments.value = index.toString();
            this.loadInstrument(this.#selectedKeybedInstrument);
        }

        setSelectedPadsInstrument(instrument: MagnitSynth.Instrument)
        {
            const index = this.#instruments.indexOf(instrument);
            if(index == -1)
            {
                throw new Error(`Cannot select instrument: Instrument has not been added to keyboard. Use the \`addInstrument\` method to include instruments.`);
            }
            this.setSelectedPadsInstrumentByIndex(index);
        }
        setSelectedPadsInstrumentByIndex(index: number)
        {
            const instrument = this.#instruments[index];
            if(instrument == null)
            {
                throw new Error(`Cannot select instrument with index ${index}: Value is null.`);
            }
            this.#selectedPadsInstrument = instrument;

            this.$padsInstruments.value = index.toString();
            this.loadInstrument(this.#selectedPadsInstrument);
        }

        setInstumentMode(instrument: MagnitSynth.Instrument, mode: string)
        {
            if(instrument.modes == null || instrument.modes.length == 0) { return; }
            instrument.selectedMode = mode;
        }


        /**
         * Get key html element from event;
         * Add drag events;
         * Open Audio context if it has not
         * been established;
         * @param event 
         */
        async key_onPointerDown(event: PointerEvent)
        {
            if(this.keyboardContext == null)
            {
                this.openContext();
                await this.loadInstruments();
            }

            if(this.#selectedKeybedInstrument == null) { return; }
            

            this.pointerIsDown = true;
            this.#pointerKey = event.currentTarget as HTMLElement;

            const keys = [].map.call(this.shadowRoot!.querySelectorAll('button.key'), item => item) as HTMLElement[];
            for(let i = 0; i < keys.length; i++)
            {
                keys[i].addEventListener('pointerenter', this.boundHandlers.key_pointerEnter);
                keys[i].addEventListener('pointerleave', this.boundHandlers.key_pointerLeave);
            }
            const note = this.createNoteFromKey(event.currentTarget as HTMLElement);
            this.#pointerKeyNote = note;
            this.note_TurnOn(this.#selectedKeybedInstrument!, note);
            this.#pointerKey.classList.add('pointer');
            console.log(this.keyboardContext!.activeNoteMap);
        }
        key_onPointerEnter(event: PointerEvent)
        {
            this.#pointerKey = event.currentTarget as HTMLElement;
            const note = this.createNoteFromKey(event.currentTarget as HTMLElement);
            this.#pointerKeyNote = note;
            this.note_TurnOn(this.#selectedKeybedInstrument!, note);
            this.#pointerKey.classList.add('pointer');
            console.log(this.keyboardContext!.activeNoteMap);
        }
        key_onPointerLeave(event: PointerEvent)
        {
            const note = this.getNoteFromKey(event.currentTarget as HTMLElement);
            this.note_TurnOff(this.#selectedKeybedInstrument!, note);
            this.#pointerKey!.classList.remove('pointer');
            console.log(this.keyboardContext!.activeNoteMap);
            this.#pointerKey = undefined;
            this.#pointerKeyNote = undefined;
        }

        async pad_onPointerDown(event: PointerEvent)
        {
            if(this.keyboardContext == null)
            {
                this.openContext();
                await this.loadInstruments();
            }

            if(this.#selectedPadsInstrument == null) { return; }        

            this.#pointerPad = event.currentTarget as HTMLElement;
            const note = this.createNoteFromPad(event.currentTarget as HTMLElement);
            this.#pointerPadNote = note;
            this.note_TurnOn(this.#selectedPadsInstrument!, note);
            this.#pointerPad.classList.add('pointer');
            console.log(this.keyboardContext!.activeNoteMap);
        }

        document_onPointerUp(event: PointerEvent)
        {
            if(this.pointerIsDown == false) { return; }

            this.pointerIsDown = false;
            
            if(this.#pointerKey != null)
            {
                this.note_TurnOff(this.#selectedKeybedInstrument!, this.#pointerKeyNote!);
                this.#pointerKey.classList.remove('pointer');
                this.#pointerKey = undefined;
                this.#pointerKeyNote = undefined;
                console.log(this.keyboardContext!.activeNoteMap);
            }
            
            const keys = [].map.call(this.shadowRoot!.querySelectorAll('button.key'), item => item) as HTMLElement[];
            for(let i = 0; i < keys.length; i++)
            {
                keys[i].removeEventListener('pointerenter', this.boundHandlers.key_pointerEnter);
                keys[i].removeEventListener('pointerleave', this.boundHandlers.key_pointerLeave);
            }

            if(this.#pointerPad != null)
            {
                this.note_TurnOff(this.#selectedPadsInstrument!, this.#pointerPadNote!);
                this.#pointerPad!.classList.remove('pointer');
                this.#pointerPad = undefined;
                this.#pointerPadNote = undefined;
                console.log(this.keyboardContext!.activeNoteMap);
            }
        }
        document_onKeyDown(event: KeyboardEvent)
        {
            if(this.#selectedKeybedInstrument == null || this.keyboardContext == null) { return; }
            if(event.repeat == true) { return; }

            const register = GlyphEntryKeyboardCodeMap.get(event.code);
            if(register == null)
            {
                return;
            }
            const note = new MagnitSynth.Note(register.defaultLabel, register.frequency, register.octave);
            note.triggerMethod = 'glyphentry';
            note.velocity = 7;
            this.#glyphEntryNotes.set(event.code, note);

            const keybedKey = this.$keybed.querySelector(`.key[data-frequency="${note.frequency}"]`)!;
            keybedKey.classList.add('glyph-entry');

            this.note_TurnOn(this.#selectedKeybedInstrument, note);
        }
        document_onKeyUp(event: KeyboardEvent)
        {
            if(this.#selectedKeybedInstrument == null || this.keyboardContext == null) { return; }

            const note = this.#glyphEntryNotes.get(event.code);
            if(note == null) { return; }
            this.note_TurnOff(this.#selectedKeybedInstrument, note!);

            const keybedKey = this.$keybed.querySelector(`.key[data-frequency="${note!.frequency}"]`)!;
            keybedKey.classList.remove('glyph-entry');
        }

        midi_OnMessage(event: Event)
        {
            if(!this.isActiveMidiController) { return; }
            // console.log(event);

            const midiEvent = event as MIDIMessageEvent;

            const command = midiEvent.data[0];

            if(command == 254)
            {
                // active sensing method; ignore
                return;
            }

            const midiNote = midiEvent.data[1];
            const velocity = midiEvent.data[2];

            console.log(command, midiNote, velocity);

            if(command == 144)
            {
                if(velocity > 0)
                {
                    const note = this.createNoteFromMidiInput(midiNote, velocity);
                    this.#midiEntryNotes.set(midiNote, note);
                    this.note_TurnOn(this.#selectedKeybedInstrument!, note);
                    const keybedKey = this.$keybed.querySelector(`.key[data-frequency="${note.frequency}"]`)!;
                    keybedKey.classList.add('midi');
                }
                else
                {
                    const note = this.#midiEntryNotes.get(midiNote);
                    if(note == null) { return; }
                    this.note_TurnOff(this.#selectedKeybedInstrument!, note);
                    const keybedKey = this.$keybed.querySelector(`.key[data-frequency="${note.frequency}"]`)!;
                    keybedKey.classList.remove('midi');
                }
            }
            if(command == 128)
            {
                const note = this.#midiEntryNotes.get(midiNote);
                if(note == null) { return; }
                this.note_TurnOff(this.#selectedKeybedInstrument!, note);
                const keybedKey = this.$keybed.querySelector(`.key[data-frequency="${note.frequency}"]`)!;
                keybedKey.classList.remove('midi');
            }
        }

        createNoteFromKey(key: HTMLElement)
        {
            const register = this.getKeybedRegister(key)!;
            const note = new MagnitSynth.Note(register.defaultLabel, register.frequency, register.octave);
            note.triggerMethod = 'pointer';
            note.velocity = 7;
            return note;
        }
        createNoteFromPad(pad: HTMLElement)
        {
            const register = this.getPadRegister(pad)!;
            const note = new MagnitSynth.Note(register.defaultLabel, register.frequency, register.octave);
            note.triggerMethod = 'pointer';
            note.velocity = 7;
            return note;
        }
        createNoteFromMidiInput(midiNote: number, velocity: number)
        {
            const frequency = MagnitSynth.convertMidiValueToFrequency(midiNote);
            const register = this.keyboardContext!.findInputRegister(KeybedRegisterKey, frequency)!;
            const note = new MagnitSynth.Note(register.defaultLabel, register.frequency, register.octave);
            note.triggerMethod = 'midi';
            note.velocity = velocity;
            return note;
        }
        getNoteFromKey(key: HTMLElement)
        {
            const instrumentMap = this.keyboardContext!.activeNoteMap.get(this.#selectedKeybedInstrument!)!;
            const mappingName = key.getAttribute('aria-label')! + key.dataset.octave;
            const noteMap = instrumentMap.get(mappingName);
            let currentNote = null;
            if(noteMap != null)
            {
                for(let [note, properties] of noteMap)
                {
                    if(note.triggerMethod == 'pointer') { currentNote = note; }
                }
            }

            if(currentNote == null) 
            { 
                currentNote = this.createNoteFromKey(key)!;
            }

            currentNote.velocity = 7;
            return currentNote;
        }
        getKeybedRegister(key: HTMLElement)
        {
            if(this.keyboardContext == null) { return; }
            const frequencyString = key.dataset.frequency!;
            const frequency = parseFloat(frequencyString);
            return this.keyboardContext.findInputRegister(KeybedRegisterKey, frequency);
        }
        getPadRegister(key: HTMLElement)
        {
            if(this.keyboardContext == null) { return; }
            const frequencyString = key.dataset.frequency!;
            const frequency = parseFloat(frequencyString);
            return this.keyboardContext.findInputRegister(PadsRegisterKey, frequency);
        }

        /**
         * Update note state
         * Trigger instument audio
         * @param note 
         * @returns 
         */
        async note_TurnOn(instrument: MagnitSynth.Instrument, note: MagnitSynth.Note)
        {
            if(this.keyboardContext == null) { return; }

            let instrumentEntry = this.keyboardContext.activeNoteMap.get(instrument);
            if(instrumentEntry == null) { return; }

            let noteMap = instrumentEntry.get(note.mappingName);
            if(noteMap == null) 
            { 
                noteMap = new Map<MagnitSynth.Note, any>();
                instrumentEntry.set(note.mappingName, noteMap);
            }

            const properties = await instrument.playNote(this.keyboardContext, note);
            noteMap.set(note, properties);

            console.log(this.keyboardContext.activeNoteMap);
        }
        async note_TurnOff(instrument: MagnitSynth.Instrument, note: MagnitSynth.Note)
        {
            // stop the note from making sound; wait for it to reach zero volume
            await instrument.endNote(this.keyboardContext!, note);

            // disconenct the note's nodes from the audio context
            instrument.disconnectNote(this.keyboardContext!, note);
            
            const instrumentEntry = this.keyboardContext!.activeNoteMap.get(instrument);
            if(instrumentEntry == null) { return; }
            
            // remove the note from the map
            const noteMap = instrumentEntry.get(note.mappingName)!;
            noteMap.delete(note);

            // if(instrumentEntry.size == 0) { this.keyboardContext!.noteMap.delete(instrument); }
            console.log(this.keyboardContext!.activeNoteMap);
        }

        addInstrument(instrument: MagnitSynth.Instrument)
        {
            this.#instruments.push(instrument);
        }

        setEditingPad($selection: HTMLButtonElement)
        {
            const padIndexString = $selection.dataset.padIndex!;
            const padIndex = parseInt(padIndexString);
            this.#editingPadIndex = padIndex;

            $selection.classList.add('selected');
            const pads = Array.from($selection.parentElement!.querySelectorAll('.pad')) as HTMLButtonElement[];
            for(let i = 0; i < pads.length; i++)
            {
                if(pads[i] == $selection) { continue; }
                pads[i].classList.remove('selected');
            }

            const $pad = this.$padsBed.querySelectorAll('.pad').item(padIndex - 1) as HTMLButtonElement;
            const note = this.getNoteFromKey($pad);

            this.$padPropertiesForm['midi-value'].value = MagnitSynth.convertFrequencyToMidiValue(note.frequency);
            this.$padPropertiesForm['note'].value = note.frequency;
            this.$padPropertiesForm['frequency'].value = note.frequency.toFixed(2);
        }
    }
}