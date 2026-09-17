import java.util.*;
public class TwodArray {
    public static void main(String[] args) {
        int[][] arr=new int[2][5];
        Scanner sc=new Scanner(System.in);
        for(int i=0;i<arr.length;i++){
            for(int j=0;j<arr[i].length;j++){
                arr[i][j]=sc.nextInt();
                    }

        }
        System.out.println("output");
        for(int i=0;i<arr.length;i++){
            for(int j=0;j<arr[i].length;j++){
                System.out.print(arr[i][j]+" ");}
            System.out.println();}
        
    }
        
}
