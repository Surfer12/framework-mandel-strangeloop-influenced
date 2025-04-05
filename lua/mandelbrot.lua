-- mandelbrot.lua
-- A Mandelbrot set renderer in Lua
-- Inspired by the beauty of mathematical patterns

local function complex_new(r, i)
  return {r = r, i = i}
end

local function complex_abs(z)
  return math.sqrt(z.r * z.r + z.i * z.i)
end

local function complex_mul(a, b)
  return {r = a.r * b.r - a.i * b.i, i = a.r * b.i + a.i * b.r}
end

local function complex_add(a, b)
  return {r = a.r + b.r, i = a.i + b.i}
end

-- Core Mandelbrot iteration function enhanced to log each recursive state.
-- This routine reinterprets the transformation z = z² + c as a communication evolution process,
-- where each iteration represents a step in refining meaning, integrating new perspectives,
-- and evolving the overall state.
local function mandelbrot_comm(c, max_iter)
  local z = complex_new(0, 0)
  local n = 0
  local states = {}  -- log of each iteration's "communication state"
  states[#states+1] = {iteration = n, z = {r = z.r, i = z.i}, commentary = "Initial state (z₀): A starting point of uncertainty."}

  while complex_abs(z) <= 2 and n < max_iter do
    -- Save the "pre-update" state (analogous to observing z squared in communication theory)
    local z_before = {r = z.r, i = z.i}

    -- Perform the recursive transformation: z = z² + c,
    -- which in our model integrates a new input ("c") representing a perspective or intervention.
    z = complex_add(complex_mul(z, z), c)
    n = n + 1

    local commentary = ""
    if n == 1 then
      commentary = "z₁: The influence of an initial external input (c) is integrated into the starting state, beginning the process of elaboration."
    elseif n == 2 then
      commentary = "z₂: The unfolding state reveals deeper structure as the previously added perspective interacts recursively with itself."
    elseif n == 3 then
      commentary = "z₃: Recurring patterns emerge; small shifts now have amplified meaning, akin to a breakthrough in understanding."
    else
      commentary = ("zₙ (n=" .. n .. "): Continuing the recursive integration, the communication state becomes increasingly complex and interconnected.")
    end

    states[#states+1] = {iteration = n, z = {r = z.r, i = z.i}, commentary = commentary}
  end
  return n, states
end

-- Render the Mandelbrot "communication image" using the enhanced recursive process.
-- Each pixel's calculation is analogized as a distinct communication evolution,
-- with optional logging for selected regions.
local function render_mandelbrot_comm(width, height, x_min, x_max, y_min, y_max, max_iter)
  local image = {}
  local states_map = {}   -- optionally collect communication states per pixel (or for a specific region)
  for y = 1, height do
    local row = {}
    for x = 1, width do
      local real = x_min + (x - 1) * (x_max - x_min) / (width - 1)
      local imag = y_min + (y - 1) * (y_max - y_min) / (height - 1)
      local c = complex_new(real, imag)
      local n, states = mandelbrot_comm(c, max_iter)
      row[x] = n
      -- For selective pixels, log the detailed communication evolution:
      if x == math.floor(width / 2) and y == math.floor(height / 2) then
        states_map["central_pixel"] = states
      end
    end
    image[y] = row
  end
  return image, states_map
end

-- Example usage: parameters defining the rendering area.
local width = 80   -- reduced width for ASCII demonstration
local height = 40  -- reduced height for faster output
local x_min = -2.5
local x_max = 1.5
local y_min = -1.5
local y_max = 1.5
local max_iter = 100

local image, states_map = render_mandelbrot_comm(width, height, x_min, x_max, y_min, y_max, max_iter)

-- Print the image (simple ASCII representation)
for y = 1, height, 2 do
  local line = ""
  for x = 1, width, 2 do
    local n = image[y][x]
    if n >= max_iter then
      line = line .. "#"
    else
      line = line .. " "
    end
  end
  print(line)
end

-- (Optional) Display the logged recursive communication states for the central pixel,
-- illustrating the evolution of the state through the recursive process.
print("\nRecursive Communication States for central pixel:")
for _, state in ipairs(states_map["central_pixel"] or {}) do
  print(string.format("Iteration %d: z = (%.3f, %.3f) | %s", state.iteration, state.z.r, state.z.i, state.commentary))
end
