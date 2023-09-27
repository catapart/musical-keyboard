// index.ts
var MagnitSynth;
((MagnitSynth2) => {
  MagnitSynth2.NoteNames_ScientificNotation = [
    "A",
    "A#",
    // G?
    "B",
    "C",
    "C#",
    // D?
    "D",
    "D#",
    // E?
    "E",
    "F",
    "F#",
    // G?
    "G",
    "G#"
    // A?
  ];
  MagnitSynth2.NotesInOctave = 12;
  const Keyboard_LengthToStartOffsetMap = /* @__PURE__ */ new Map([
    [88, -48],
    [61, -33],
    [49, -21],
    [32, -9],
    [25, -9]
  ]);
  MagnitSynth2.MinimumSupportedRegisterDistance = -69;
  MagnitSynth2.MaximumSupportedRegisterDistance = 143;
  MagnitSynth2.A4Frequency = 440;
  MagnitSynth2.MiddleCFrequency = 261.6256;
  MagnitSynth2.FrequencyTolerance = 0.3;
  MagnitSynth2.MiddleC_LowTolerance = MagnitSynth2.MiddleCFrequency - MagnitSynth2.FrequencyTolerance;
  MagnitSynth2.MiddleC_HighTolerance = MagnitSynth2.MiddleCFrequency + MagnitSynth2.FrequencyTolerance;
  class ControllerContext {
    audioContext;
    mainVolumeGainNode;
    activeNoteMap;
    controllerInputRegistersMap;
    // keybedRegisters: Map<number, Register>; // keybed is a dynamic index input; number of notes represented changes (88, 61, etc); 
    // padsRegisters: Map<number, Register>; // pads input is a static index input; number of notes represented is always the same: 10; 
    constructor() {
      this.audioContext = new AudioContext();
      this.mainVolumeGainNode = this.audioContext.createGain();
      this.mainVolumeGainNode.connect(this.audioContext.destination);
      this.controllerInputRegistersMap = /* @__PURE__ */ new Map();
      this.activeNoteMap = /* @__PURE__ */ new Map();
    }
    findInputRegister(sectionKey, frequency) {
      const sectionInputs = this.controllerInputRegistersMap.get(sectionKey);
      if (sectionInputs == null) {
        throw new Error("Unknown ");
      }
      const lowTolerance = frequency - MagnitSynth2.FrequencyTolerance;
      const highTolerance = frequency + MagnitSynth2.FrequencyTolerance;
      let value = frequency;
      let foundRegister = null;
      for (const [currentFrequency, register] of sectionInputs) {
        if (currentFrequency == frequency) {
          foundRegister = register;
          break;
        }
        if (currentFrequency > lowTolerance && currentFrequency < highTolerance) {
          foundRegister = register;
          break;
        }
      }
      return foundRegister;
    }
    // findKeybedRegister(frequency: number)
    // {
    //     const lowTolerance = frequency - FrequencyTolerance;
    //     const highTolerance = frequency + FrequencyTolerance;
    //     let value = frequency;
    //     for(const [currentFrequency, message] of this.keybedRegisters)
    //     {
    //         if(currentFrequency == frequency) { break; }
    //         if(currentFrequency > lowTolerance && currentFrequency < highTolerance)
    //         {
    //             value = currentFrequency;
    //             break;
    //         }
    //     }
    //     return this.keybedRegisters.get(value);
    // }
    // findPadRegister(frequency: number)
    // {            
    //     const lowTolerance = frequency - FrequencyTolerance;
    //     const highTolerance = frequency + FrequencyTolerance;
    //     let value = frequency;
    //     for(const [currentFrequency, message] of this.padsRegisters)
    //     {
    //         if(currentFrequency == frequency) { break; }
    //         if(currentFrequency > lowTolerance && currentFrequency < highTolerance)
    //         {
    //             value = currentFrequency;
    //             break;
    //         }
    //     }
    //     return this.padsRegisters.get(value);
    // }
    findActiveNoteProperties(instrument, note) {
      const instrumentEntry = this.activeNoteMap.get(instrument);
      if (instrumentEntry == null) {
        return null;
      }
      const noteMap = instrumentEntry.get(note.mappingName);
      if (noteMap == null) {
        return null;
      }
      return noteMap.get(note);
    }
  }
  MagnitSynth2.ControllerContext = ControllerContext;
  class Note {
    constructor(name, frequency, octave) {
      this.name = name;
      this.frequency = frequency;
      this.octave = octave;
    }
    triggerMethod = "pointer";
    velocity = 0;
    playbackTimeout;
    get mappingName() {
      return this.name + this.octave.toString();
    }
    static fromMidiInput(data) {
    }
  }
  MagnitSynth2.Note = Note;
  class Sample {
    path;
    name;
    noteName;
    noteFrequency;
    noteVelocity;
    playbackSpeed = 1;
    dataBuffer;
    audioBuffer;
    get isLoaded() {
      return this.dataBuffer != null;
    }
    constructor(path, noteName, noteFrequency, name = "") {
      this.path = path;
      this.name = name;
      this.noteName = noteName;
      this.noteFrequency = noteFrequency;
      const vIndex = this.name.indexOf("v");
      if (vIndex > -1) {
        const velocityString = this.name.substring(vIndex + 1, this.name.lastIndexOf("."));
        this.noteVelocity = parseInt(velocityString);
      } else {
        this.noteVelocity = 7;
      }
    }
    async load(context) {
      if (this.isLoaded == true) {
        console.log("skipped load");
        return;
      }
      const resourcePath = new URL(this.path, import.meta.url).href;
      const idbResponse = await loadFromCache(resourcePath);
      if (idbResponse != null) {
        this.dataBuffer = idbResponse.value;
      } else {
        const response = await fetch(resourcePath);
        if (response.ok == false) {
          throw new Error(`Error loading audio file: ${resourcePath}`);
        }
        this.dataBuffer = await response.arrayBuffer();
        await saveToCache(resourcePath, this.dataBuffer);
      }
      this.audioBuffer = await context.audioContext.decodeAudioData(structuredClone(this.dataBuffer));
    }
  }
  MagnitSynth2.Sample = Sample;
  class Register {
    frequency = -1;
    octave = -1;
    defaultLabel = "";
    constructor(defaultLabel, frequency, octave) {
      this.defaultLabel = defaultLabel ?? this.defaultLabel;
      this.frequency = frequency ?? this.frequency;
      this.octave = octave ?? this.octave;
    }
  }
  MagnitSynth2.Register = Register;
  class KeybedRegister extends Register {
    offset = -1;
  }
  MagnitSynth2.KeybedRegister = KeybedRegister;
  class SimpleSampleInstrument {
    name;
    selectedMode;
    modes = [];
    samples = [];
    isLoaded = false;
    constructor(samples) {
      this.samples = samples ?? this.samples;
    }
    static fromSampleIndexMap(sampleData) {
    }
    static fromSamples(sampleData) {
    }
    static intoSamples(context, paths, offsetFromA0 = 0, sectionKey = "main") {
      const samples = [];
      const registers = getIndexedRegisters();
      for (let i = offsetFromA0; i < offsetFromA0 + paths.length; i++) {
        const entry = paths[i - offsetFromA0];
        const register = registers[i];
        const inputRegister = context.findInputRegister(sectionKey, register.frequency);
        if (inputRegister == null) {
          console.error("InputMessage not found");
          continue;
        }
        if (Array.isArray(entry)) {
          for (let j = 0; j < entry.length; j++) {
            const entryValue = entry[j];
            const name2 = entryValue.indexOf("/") == -1 ? entryValue : entryValue.substring(entryValue.lastIndexOf("/") + 1);
            samples.push(new Sample(entryValue, inputRegister.defaultLabel, register.frequency, name2));
          }
          continue;
        }
        const name = entry.indexOf("/") == -1 ? entry : entry.substring(entry.lastIndexOf("/") + 1);
        samples.push(new Sample(entry, inputRegister.defaultLabel, register.frequency, name));
      }
      return samples;
    }
    static intoSamples_Frequency(context, sampleData, sectionKey = "main") {
      const samples = [];
      for (const [frequency, paths] of sampleData) {
        const inputRegister = context.findInputRegister(sectionKey, frequency);
        if (inputRegister == null) {
          console.error("Input Register not found");
          continue;
        }
        for (let i = 0; i < paths.length; i++) {
          const pathValue = paths[i];
          const name = pathValue.indexOf("/") == -1 ? pathValue : pathValue.substring(pathValue.lastIndexOf("/") + 1);
          samples.push(new Sample(pathValue, inputRegister.defaultLabel, frequency, name));
        }
      }
      return samples;
    }
    async load(context, onProgressEvent) {
      try {
        const promises = [];
        for (let i = 0; i < this.samples.length; i++) {
          promises.push(new Promise(async (resolve) => {
            await this.samples[i].load(context);
            if (onProgressEvent != null) {
              const progress = parseFloat((i / this.samples.length * 100).toFixed(2));
              onProgressEvent({ instrument: this, progress });
            }
            resolve();
          }));
        }
        await Promise.all(promises);
        if (onProgressEvent != null) {
          onProgressEvent({ instrument: this, progress: 100 });
        }
      } catch (error) {
        console.error(error);
      }
    }
    async playNote(context, note) {
      const sample = this.findClosestSample(note);
      const properties = {
        sample,
        gainNode: context.audioContext.createGain(),
        volume: 0.5,
        audioSourceNode: context.audioContext.createBufferSource()
      };
      properties.audioSourceNode.buffer = sample.audioBuffer;
      properties.audioSourceNode.connect(properties.gainNode);
      properties.gainNode.connect(context.mainVolumeGainNode);
      properties.gainNode.gain.setValueAtTime(0, context.audioContext.currentTime);
      properties.gainNode.gain.linearRampToValueAtTime(0.5, context.audioContext.currentTime + 0.02);
      properties.audioSourceNode.start();
      return properties;
    }
    findClosestSample(note) {
      if (this.samples.length == 0) {
        throw new Error("Cannot find samples when samples property is empty.");
      }
      let highestVelocity_closestFrequency_Sample = this.samples[0];
      for (let i = 1; i < this.samples.length; i++) {
        const sample = this.samples[i];
        if (note.frequency + MagnitSynth2.FrequencyTolerance <= sample.noteFrequency) {
          break;
        }
        highestVelocity_closestFrequency_Sample = sample;
      }
      const velocitySamples = this.samples.filter((sample) => sample.noteFrequency == highestVelocity_closestFrequency_Sample.noteFrequency);
      let lowestDifference = 0;
      let closestSample = velocitySamples[0];
      for (let i = 0; i < velocitySamples.length; i++) {
        if (note.velocity == velocitySamples[i].noteVelocity) {
          closestSample = velocitySamples[i];
          break;
        } else {
          const difference = Math.abs(note.velocity - velocitySamples[i].noteVelocity);
          if (lowestDifference == 0 || difference < lowestDifference) {
            lowestDifference = difference;
            closestSample = velocitySamples[i];
          }
        }
      }
      return closestSample;
    }
    async endNote(context, note) {
      return new Promise((resolve) => {
        const noteProperties = context.findActiveNoteProperties(this, note);
        if (noteProperties == null) {
          throw new Error("Could not find note");
        }
        noteProperties.gainNode.gain.cancelScheduledValues(context.audioContext.currentTime);
        noteProperties.gainNode.gain.setValueAtTime(noteProperties.gainNode.gain.value, context.audioContext.currentTime);
        noteProperties.gainNode.gain.linearRampToValueAtTime(0, context.audioContext.currentTime + 0.2);
        if (note.playbackTimeout != null) {
          clearTimeout(note.playbackTimeout);
        }
        note.playbackTimeout = setTimeout(() => {
          resolve();
        }, 202);
      });
    }
    disconnectNote(context, note) {
      const noteProperties = context.findActiveNoteProperties(this, note);
      if (noteProperties == null) {
        throw new Error("Could not find note");
      }
      noteProperties.audioSourceNode.disconnect();
      noteProperties.gainNode.disconnect();
    }
  }
  MagnitSynth2.SimpleSampleInstrument = SimpleSampleInstrument;
  class InterpolatedSampleInstrument extends SimpleSampleInstrument {
    async playNote(context, note) {
      const sample = this.findClosestSample(note);
      const properties = {
        sample,
        gainNode: context.audioContext.createGain(),
        volume: 0.5,
        audioSourceNode: context.audioContext.createBufferSource()
      };
      properties.audioSourceNode.buffer = sample.audioBuffer;
      properties.audioSourceNode.connect(properties.gainNode);
      properties.gainNode.connect(context.mainVolumeGainNode);
      properties.gainNode.gain.setValueAtTime(0, context.audioContext.currentTime);
      properties.gainNode.gain.linearRampToValueAtTime(0.5, context.audioContext.currentTime + 0.02);
      const noteMidiValue = MagnitSynth2.convertFrequencyToMidiValue(note.frequency);
      const cents = noteMidiValue - Math.round(noteMidiValue);
      const sampleMidiValue = MagnitSynth2.convertFrequencyToMidiValue(sample.noteFrequency);
      const midiDistance = noteMidiValue - sampleMidiValue;
      const intervalDistance = midiDistance + cents;
      const playbackRate = convertIntervalToFrequencyRatio(intervalDistance);
      properties.audioSourceNode.playbackRate.value = playbackRate;
      properties.audioSourceNode.start();
      return properties;
    }
  }
  MagnitSynth2.InterpolatedSampleInstrument = InterpolatedSampleInstrument;
  class WaveTableData {
    constructor(real, imaginary) {
      this.real = real;
      this.imaginary = imaginary;
    }
  }
  MagnitSynth2.WaveTableData = WaveTableData;
  let KeybedRegisters = null;
  let IndexedRegisters = null;
  function frequencyRangeToKeybedRegisters(start, end) {
    let black = 0;
    let white = -2;
    let frequencies = new Array(end - start);
    for (let i = 0; i < frequencies.length; i++) {
      const key = (start + i) % MagnitSynth2.NotesInOctave;
      const note = MagnitSynth2.NoteNames_ScientificNotation[key < 0 ? MagnitSynth2.NotesInOctave + key : key];
      const octave = Math.ceil(4 + (start + i) / MagnitSynth2.NotesInOctave);
      if (i == 0 && note == "C") {
        black = -3;
      }
      if (note.indexOf("#") > -1) {
        black += 3;
        if (note == "C#" || note == "F#") {
          black += 3;
        }
      } else {
        white += 3;
      }
      frequencies[i] = {
        defaultLabel: note,
        frequency: getHertz(start + i),
        octave: note == "B" || note == "A#" ? octave - 1 : octave,
        offset: note.indexOf("#") > -1 ? black : white
      };
    }
    KeybedRegisters = frequencies;
    return KeybedRegisters;
  }
  MagnitSynth2.frequencyRangeToKeybedRegisters = frequencyRangeToKeybedRegisters;
  function frequencyRangeToRegisters(start, end) {
    let frequencies = new Array(end - start);
    for (let i = 0; i < frequencies.length; i++) {
      const interval = (start + i) % MagnitSynth2.NotesInOctave;
      const note = MagnitSynth2.NoteNames_ScientificNotation[interval < 0 ? MagnitSynth2.NotesInOctave + interval : interval];
      const octave = Math.ceil(4 + (start + i) / MagnitSynth2.NotesInOctave);
      frequencies[i] = {
        defaultLabel: note,
        frequency: getHertz(start + i),
        octave: note == "B" || note == "A#" ? octave - 1 : octave
      };
    }
    return frequencies;
  }
  MagnitSynth2.frequencyRangeToRegisters = frequencyRangeToRegisters;
  function registerCountToRegisters(count, start = MagnitSynth2.MinimumSupportedRegisterDistance) {
    if (start < MagnitSynth2.MinimumSupportedRegisterDistance || start > MagnitSynth2.MaximumSupportedRegisterDistance) {
      throw new Error("Cannot create registers outside of frequency bounds.");
    }
    const end = start + count;
    if (end < MagnitSynth2.MinimumSupportedRegisterDistance || end > MagnitSynth2.MaximumSupportedRegisterDistance) {
      throw new Error("Cannot create registers outside of frequency bounds.");
    }
    return frequencyRangeToRegisters(start, end);
  }
  MagnitSynth2.registerCountToRegisters = registerCountToRegisters;
  function registerCountToKeybedRegisters(count, start = MagnitSynth2.MinimumSupportedRegisterDistance) {
    if (start < MagnitSynth2.MinimumSupportedRegisterDistance || start > MagnitSynth2.MaximumSupportedRegisterDistance) {
      throw new Error("Cannot create registers outside of frequency bounds.");
    }
    const end = start + count;
    if (end < MagnitSynth2.MinimumSupportedRegisterDistance || end > MagnitSynth2.MaximumSupportedRegisterDistance) {
      throw new Error("Cannot create registers outside of frequency bounds.");
    }
    return frequencyRangeToKeybedRegisters(start, end);
  }
  MagnitSynth2.registerCountToKeybedRegisters = registerCountToKeybedRegisters;
  function getKeybedRegisters(count = 88) {
    if (KeybedRegisters != null && KeybedRegisters.length == count) {
      return KeybedRegisters;
    }
    const start = Keyboard_LengthToStartOffsetMap.get(count);
    if (start == null) {
      throw new Error("Unknown keyboard key count requested.");
    }
    const end = start + count;
    return frequencyRangeToKeybedRegisters(start, end);
  }
  MagnitSynth2.getKeybedRegisters = getKeybedRegisters;
  function getIndexedRegisters() {
    if (IndexedRegisters != null) {
      return IndexedRegisters;
    }
    const start = MagnitSynth2.MinimumSupportedRegisterDistance;
    const end = MagnitSynth2.MaximumSupportedRegisterDistance;
    return frequencyRangeToRegisters(start, end);
  }
  MagnitSynth2.getIndexedRegisters = getIndexedRegisters;
  function getHertz(n = 0) {
    return MagnitSynth2.A4Frequency * Math.pow(2, n / MagnitSynth2.NotesInOctave);
  }
  MagnitSynth2.getHertz = getHertz;
  function convertFrequencyToMidiValue(frequency) {
    return 69 + 12 * Math.log2(frequency / MagnitSynth2.A4Frequency);
  }
  MagnitSynth2.convertFrequencyToMidiValue = convertFrequencyToMidiValue;
  function convertMidiValueToFrequency(note) {
    return MagnitSynth2.A4Frequency * Math.pow(2, (note - 69) / 12);
  }
  MagnitSynth2.convertMidiValueToFrequency = convertMidiValueToFrequency;
  function convertIntervalToFrequencyRatio(interval) {
    return Math.pow(2, interval / 12);
  }
  MagnitSynth2.convertIntervalToFrequencyRatio = convertIntervalToFrequencyRatio;
  const CacheDatabaseName = "MusicalKeyboardCache";
  const CacheDatabaseVersion = 1;
  const CacheDatabaseSchema = { items: "path" };
  let CacheDatabase;
  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(CacheDatabaseName, CacheDatabaseVersion);
      request.onsuccess = (event) => {
        const dbEvent = event.target;
        CacheDatabase = dbEvent.result;
        resolve();
      };
      request.onupgradeneeded = async (event) => {
        const dbEvent = event.target;
        CacheDatabase = dbEvent.result;
        await createDatabase(CacheDatabaseSchema);
        resolve();
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }
  function createDatabase(schema) {
    const storePromises = [];
    for (const [tableName, columnName] of Object.entries(schema)) {
      storePromises.push(new Promise((resolve, reject) => {
        const objectStore = CacheDatabase.createObjectStore(tableName, { keyPath: columnName });
        objectStore.transaction.oncomplete = (event) => {
          resolve();
        };
        objectStore.transaction.onerror = (event) => {
          reject(event);
        };
      }));
    }
    return Promise.all(storePromises);
  }
  async function openDatabaseTransaction() {
    if (CacheDatabase == null) {
      await openDatabase();
    }
    return new Promise(async (resolve, reject) => {
      if (CacheDatabase == null) {
        reject("The database has not been opened.");
        return;
      }
      const transaction = CacheDatabase.transaction("items", "readwrite");
      transaction.onerror = (event) => {
        reject(event);
      };
      resolve(transaction);
    });
  }
  function loadFromCache(key) {
    return new Promise(async (resolve, reject) => {
      const transaction = await openDatabaseTransaction();
      const objectStore = transaction.objectStore("items");
      const request = objectStore.get(key);
      request.onsuccess = (event) => {
        const value = event.target.result;
        resolve(value);
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }
  function saveToCache(key, data) {
    return new Promise(async (resolve, reject) => {
      const transaction = await openDatabaseTransaction();
      const objectStore = transaction.objectStore("items");
      const request = objectStore.put({ path: key, value: data });
      request.onsuccess = (event) => {
        const value = event.target.result;
        resolve(value);
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }
})(MagnitSynth || (MagnitSynth = {}));
export {
  MagnitSynth
};
