import Forge from "../ForgeDefine";

Forge.LogF = function(msg) {};
Forge.LogE = function(msg) {};
Forge.LogW = function(msg) {};
Forge.LogI = function(msg) {};
Forge.LogD = function(msg) {};
Forge.LogM = function(msg) {}; // mark console log(usually for important debug message which already comment out)

Forge.ThrowError = function(msg) { throw new Error(msg); };
Forge.Assert = function(assert_condition) { if (!assert_condition) { /* debugger; */throw new Error("ASSERT!!!!!"); } };

Forge.EnableLog = function(level) {
  Forge.LogM = console.log.bind(console);
  if (level > 0) { Forge.LogF = console.error.bind(console); }

  if (level > 1) { Forge.LogE = console.error.bind(console); }

  if (level > 2) { Forge.LogW = console.warn.bind(console); }

  if (level > 3) { Forge.LogI = console.log.bind(console); }

  if (level > 4) { Forge.LogD = console.debug.bind(console); }
};
