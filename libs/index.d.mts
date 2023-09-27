declare namespace MagnitSynth {
    const NoteNames_ScientificNotation: string[];
    const NotesInOctave = 12;
    const MinimumSupportedRegisterDistance = -69;
    const MaximumSupportedRegisterDistance = 143;
    const A4Frequency = 440;
    const MiddleCFrequency = 261.6256;
    const FrequencyTolerance = 0.3;
    const MiddleC_LowTolerance: number;
    const MiddleC_HighTolerance: number;
    interface DigitalController extends HTMLElement {
    }
    class ControllerContext {
        audioContext: AudioContext;
        mainVolumeGainNode: GainNode;
        activeNoteMap: Map<Instrument, Map<string, Map<Note, NoteProperties>>>;
        controllerInputRegistersMap: Map<string, Map<number, Register>>;
        constructor();
        findInputRegister(sectionKey: string, frequency: number): Register | null;
        findActiveNoteProperties(instrument: Instrument, note: Note): NoteProperties | null | undefined;
    }
    class Note {
        name: string;
        frequency: number;
        octave: number;
        triggerMethod: 'pointer' | 'midi' | 'glyphentry';
        velocity: number;
        playbackTimeout?: number;
        get mappingName(): string;
        constructor(name: string, frequency: number, octave: number);
        static fromMidiInput(data: any): void;
    }
    class Sample {
        path: string;
        name: string;
        noteName: string;
        noteFrequency: number;
        noteVelocity: number;
        playbackSpeed: number;
        dataBuffer?: ArrayBuffer;
        audioBuffer?: AudioBuffer;
        get isLoaded(): boolean;
        constructor(path: string, noteName: string, noteFrequency: number, name?: string);
        load(context: ControllerContext): Promise<void>;
    }
    /**
     * A register is a frequency paired with an
     * octave to reference a distinct point on the
     * audio spectrum.
     *
     * Each key on a keyboard or each pad on a midi
     * pad can be thought of as a register of a
     * fundamental note frequency. Registers what
     * is used to define which notes specific
     * inputs should play.
     *
     * Registers correspond to the 12 notes of the
     * western scale. This library represents the full
     * spectrum that midi covers with 10 registrations
     * for each natural and accidental (sharp or flat) note.
     */
    class Register {
        frequency: number;
        octave: number;
        defaultLabel: string;
        constructor(defaultLabel?: string, frequency?: number, octave?: number);
    }
    class KeybedRegister extends Register {
        offset: number;
    }
    interface Instrument {
        /**
         * A label-formatted name for displaying in the UI.
         */
        name: string;
        modes: string[];
        selectedMode?: string;
        load?: (context: ControllerContext, onProgressEvent?: (event: {
            instrument: MagnitSynth.Instrument;
            progress: number;
        }) => void) => Promise<void>;
        playNote: (context: ControllerContext, note: any) => Promise<NoteProperties>;
        endNote: (context: ControllerContext, note: any) => Promise<void>;
        disconnectNote: (context: ControllerContext, note: any) => void;
    }
    interface Oscillator {
        selectedMode: OscillatorType;
    }
    abstract class SimpleSampleInstrument implements Instrument {
        name: string;
        selectedMode?: string;
        modes: string[];
        samples: Sample[];
        isLoaded: boolean;
        constructor(samples?: Sample[]);
        static fromSampleIndexMap(sampleData: Map<string, number>): void;
        static fromSamples(sampleData: Sample[]): void;
        static intoSamples(context: ControllerContext, paths: (string | string[])[], offsetFromA0?: number, sectionKey?: string): Sample[];
        static intoSamples_Frequency(context: ControllerContext, sampleData: Map<number, string[]>, sectionKey?: string): Sample[];
        load(context: ControllerContext, onProgressEvent?: (event: {
            instrument: MagnitSynth.Instrument;
            progress: number;
        }) => void): Promise<void>;
        playNote(context: ControllerContext, note: Note): Promise<SampleNoteProperties>;
        findClosestSample(note: Note): Sample;
        endNote(context: ControllerContext, note: Note): Promise<void>;
        disconnectNote(context: ControllerContext, note: Note): void;
    }
    abstract class InterpolatedSampleInstrument extends SimpleSampleInstrument {
        playNote(context: ControllerContext, note: Note): Promise<SampleNoteProperties>;
    }
    type NoteProperties = {
        gainNode: GainNode;
        volume: number;
        isProcessing?: boolean;
        [key: string]: any;
    };
    type OscillatorNoteProperties = NoteProperties & {
        oscillatorNode: OscillatorNode;
    };
    type SampleNoteProperties = NoteProperties & {
        audioSourceNode: AudioBufferSourceNode;
        sample: Sample;
    };
    class WaveTableData {
        real: number[];
        imaginary: number[];
        constructor(real: number[], imaginary: number[]);
    }
    function frequencyRangeToKeybedRegisters(start: number, end: number): KeybedRegister[];
    function frequencyRangeToRegisters(start: number, end: number): Register[];
    function registerCountToRegisters(count: number, start?: number): Register[];
    function registerCountToKeybedRegisters(count: number, start?: number): KeybedRegister[];
    function getKeybedRegisters(count?: number): KeybedRegister[];
    function getIndexedRegisters(): Register[];
    function getHertz(n?: number): number;
    function convertFrequencyToMidiValue(frequency: number): number;
    function convertMidiValueToFrequency(note: number): number;
    function convertIntervalToFrequencyRatio(interval: number): number;
}

export { MagnitSynth };
