#include <stddef.h>
#include <stdlib.h>
#include <stdio.h>

const unsigned long initial_stones[] = { 2, 77706, 5847, 9258441, 0, 741, 883933, 12 };

const unsigned int blink_count = 75;


const unsigned int initial_stones_length = sizeof(initial_stones)/sizeof(*initial_stones);

unsigned long total_stones = 0;

void walk(unsigned long stone, unsigned int level = 0) {
    if (level >= blink_count) {
        total_stones++;
    } else {
        if (stone == 0) {
//printf("stone is 0\n");//!!!
            walk(1, level+1);
        } else {
            char stone_digits[100];  // plenty of room
            const unsigned long stone_digits_length = snprintf(stone_digits, sizeof(stone_digits), "%lu", stone);
//printf(">>> stone_digits_length = %lu, (stone_digits_length & 1UL) = %lu, stone_digits = \"%s\"\n", stone_digits_length, (stone_digits_length & 1UL), stone_digits);//!!!
            if ((stone_digits_length & 1UL) == 0) {  // even number of digits?
//printf(">>>>>>>>>>>>>>>>>stone has an even number of digits\n");//!!!
                const auto mid = stone_digits_length / 2;
                const unsigned long stone2 = (unsigned long)atol(&stone_digits[mid]);
                stone_digits[mid] = '\0';
                const unsigned long stone1 = (unsigned long)atol(stone_digits);
                walk(stone1, level+1);
                walk(stone2, level+1);
            } else {
//printf("stone has an odd number of digits\n");//!!!
                walk((stone * 2024UL), level+1);
            }
        }
    }
}

unsigned long perform_blinks() {
    total_stones = 0;

    for (unsigned int i = 0; i < initial_stones_length; i++) {
        walk(initial_stones[i]);
    }

    return total_stones;
}

int main(int argc, const char* argv[]) {
    printf("hello, world, sizeof(long) = %d.\n", sizeof(long));

    printf("initial_stones: ");
    const char* sep = "";
    for (int i = 0; i < initial_stones_length; i++) {
        printf("%s%ld", sep, initial_stones[i]);
        sep = ", ";
    }
    printf("\n");

    printf("blink_count = %u\n", blink_count);

    printf("calculating...");
    const unsigned long total_stones = perform_blinks();
    printf("\n");
    printf("The number of stones after %u blink%s is %lu.\n", blink_count, (blink_count == 1 ? "" : "s"), total_stones);

    return 0;
}
