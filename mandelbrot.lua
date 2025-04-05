-- mandelbrot.lua
-- A Mandelbrot set renderer in Lua
-- Inspired by the beauty of mathematical patterns

local function mandelbrot(c, max_iter)
    local z = 0
    local n = 0
    while math.abs(z) <= 2 and n < max_iter do
        z = z * z + c
        n = n + 1
    end
    return n
end

local function render_mandelbrot(width, height, x_min, x_max, y_min, y_max, max_iter)
    local image = {}
    for y = 1, height do
        local row = {}
        for x = 1, width do
            local real = x_min + (x - 1) * (x_max - x_min) / (width - 1)
            local imag = y_min + (y - 1) * (y_max - y_min) / (height - 1)
            local c = complex(real, imag)
            local n = mandelbrot(c, max_iter)
            row[x] = n
        end
        image[y] = row
    end
    return image
end

-- Example usage
local width = 800
local height = 600
local x_min = -2.5
local x_max = 1.5
local y_min = -1.5
local y_max = 1.5
local max_iter = 1000

local image = render_mandelbrot(width, height, x_min, x_max, y_min, y_max, max_iter)

-- Print the image (simple ASCII representation)
for y = 1, height, 2 do
    local line = ""
    for x = 1, width, 2 do
        local n = image[y][x]
        if n == max_iter then
            line = line .. "#"
        else
            line = line .. " "
        end
    end
    print(line)
end 